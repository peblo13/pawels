$(document).ready(function(){
    // Konfiguracja karuzeli szablonów CV
    $('.cv-carousel').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: true
    });

    // Pobieranie ofert pracy z fetch_jobs.php
    $.getJSON('fetch_jobs.php', function(data) {
        renderJobs(data.slice(0, 16));
        renderPagination(data.length);
    });

    // Funkcja renderująca oferty pracy
    function renderJobs(jobs) {
        var jobListings = $('#job-listings');
        jobListings.empty();
        $.each(jobs, function(index, job) {
            var descriptionParts = job.description.split(', ');
            var location = descriptionParts[0].split(': ')[1].replace(/"/g, '');
            var contract = descriptionParts[1].split(': ')[1].replace(/"/g, '');
            var company = descriptionParts[2].split(': ')[1].replace(/"/g, '');
            var available_from = descriptionParts[3].split(': ')[1].replace(/"/g, '');

            var jobSquare = `
                <div class="job-square">
                    <h3>${job.title}</h3>
                    <p>${location}</p>
                    <div class="job-description">
                        <p>Rodzaj umowy: ${contract}</p>
                        <p>Pracodawca: ${company}</p>
                        <p>Dostępna od: ${available_from}</p>
                        <p>${job.description}</p>
                    </div>
                </div>
            `;
            jobListings.append(jobSquare);
        });

        // Dodaj animację powiększania kwadratów
        $('.job-square').hover(function() {
            $(this).find('.job-description').slideDown();
        }, function() {
            $(this).find('.job-description').slideUp();
        });
    }

    // Funkcja renderująca paginację
    function renderPagination(totalJobs) {
        const totalPages = Math.ceil(totalJobs / 16);
        const pagination = $('#pagination');
        pagination.empty();
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = `<button class="page-btn" data-page="${i}">${i}</button>`;
            pagination.append(pageButton);
        }
    }

    // Obsługa paginacji
    $(document).on('click', '.page-btn', function() {
        const page = $(this).data('page');
        $.getJSON('fetch_jobs.php', function(data) {
            const start = (page - 1) * 16;
            const end = start + 16;
            renderJobs(data.slice(start, end));
        });
    });

    // Obsługa wyszukiwania
    $('#search-form').on('submit', function(e) {
        e.preventDefault();
        const query = $('#search-input').val().toLowerCase();
        $.getJSON('fetch_jobs.php', function(data) {
            const filteredJobs = data.filter(job => {
                const descriptionParts = job.description.split(', ');
                const location = descriptionParts[0].split(': ')[1].replace(/"/g, '');
                return job.title.toLowerCase().includes(query) || location.toLowerCase().includes(query);
            });
            renderJobs(filteredJobs.slice(0, 16));
            renderPagination(filteredJobs.length);
        });
    });
});