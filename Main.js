document.addEventListener('DOMContentLoaded', function() {
    const jobListings = document.getElementById('job-listings');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const pagination = document.getElementById('pagination');
    const jobCount = document.getElementById('job-count');
    const menuToggle = document.querySelector('.menu-toggle');
    const navbarMenu = document.querySelector('.navbar ul');

    let jobs = [];
    const jobsPerPage = 20; // Liczba ofert pracy na stronę
    let currentPage = 1;

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('showing');
        });
    }

    function displayJobs(jobsToDisplay, page = 1) {
        if (!Array.isArray(jobsToDisplay)) {
            console.error('jobsToDisplay is not an array');
            return;
        }

        jobListings.innerHTML = '';
        const start = (page - 1) * jobsPerPage;
        const end = start + jobsPerPage;
        const paginatedJobs = jobsToDisplay.slice(start, end);

        paginatedJobs.forEach(job => {
            const jobSquare = document.createElement('div');
            jobSquare.classList.add('job-square');

            const jobTitle = document.createElement('h3');
            jobTitle.textContent = job.title;
            jobTitle.style.color = '#ffffff'; // Biały tekst dla stanowiska
            jobSquare.appendChild(jobTitle);

            const jobLocation = document.createElement('p');
            jobLocation.innerHTML = `<span class="location-marker">📍</span>${job.location}`;
            jobSquare.appendChild(jobLocation);

            const jobDescription = document.createElement('div');
            jobDescription.classList.add('job-description');
            jobDescription.textContent = `Firma: ${job.company}\nUmowa: ${job.contract}\nDostępne od: ${job.available_from}`;
            jobSquare.appendChild(jobDescription);

            const applyButton = document.createElement('button');
            applyButton.classList.add('apply-button');
            applyButton.textContent = 'Aplikuj';
            applyButton.addEventListener('click', () => {
                openApplyForm(job.title);
            });
            jobSquare.appendChild(applyButton);

            jobListings.appendChild(jobSquare);
        });

        displayPagination(jobsToDisplay.length, page);
        updateJobCount(jobsToDisplay.length);
    }

    function displayPagination(totalJobs, page) {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalJobs / jobsPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<-';
        prevButton.classList.add('page-button');
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayJobs(jobs, currentPage);
            }
        });
        pagination.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.classList.add('page-info');
        pageInfo.textContent = ` ${page} -> ${totalPages} `;
        pagination.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = '->';
        nextButton.classList.add('page-button');
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayJobs(jobs, currentPage);
            }
        });
        pagination.appendChild(nextButton);
    }

    function updateJobCount(count) {
        jobCount.textContent = `Liczba ofert pracy: ${count}`;
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        const filteredJobs = jobs.filter(job => 
            job.location.toLowerCase().includes(searchTerm) || 
            job.title.toLowerCase().includes(searchTerm)
        );
        displayJobs(filteredJobs, 1);
    });

    // Fetch jobs from ue.json
    fetch('ue.json')
        .then(response => response.json())
        .then(data => {
            if (data.jobs && Array.isArray(data.jobs)) {
                jobs = data.jobs;
                displayJobs(jobs, currentPage);
                updateJobCount(jobs.length); // Aktualizacja licznika po załadowaniu danych
            } else {
                console.error('Data from ue.json is not an array');
            }
        })
        .catch(error => console.error('Error loading job data:', error));

    // Karuzela CV
    const carousel = document.querySelector('.kreator-cv-list');
    if (carousel) {
        const templates = carousel.querySelectorAll('.kreator-cv-item');
        let currentIndex = 0;

        function showTemplate(index) {
            templates.forEach((template, i) => {
                template.classList.toggle('active', i === index);
            });
        }

        showTemplate(currentIndex);

        // Automatyczne przełączanie szablonów co 2 sekundy
        setInterval(() => {
            currentIndex = (currentIndex < templates.length - 1) ? currentIndex + 1 : 0;
            showTemplate(currentIndex);
        }, 2000);
    }

    function openApplyForm(jobTitle) {
        const applyForm = document.createElement('div');
        applyForm.classList.add('apply-form');
        applyForm.innerHTML = `
            <div class="apply-form-header">
                <h3 style="color: #ffffff;">Aplikuj na stanowisko: ${jobTitle}</h3>
                <button class="close-button">X</button>
            </div>
            <form>
                <label for="name">Imię i Nazwisko:</label>
                <input type="text" id="name" name="name" required>
                <label for="start-date">Od kiedy możesz zacząć:</label>
                <input type="date" id="start-date" name="start-date" required>
                <label for="cv">Załącz CV (PDF):</label>
                <input type="file" id="cv" name="cv" accept="application/pdf" required>
                <button type="submit" class="submit-button">Wyślij</button>
            </form>
        `;
        document.body.appendChild(applyForm);
        applyForm.style.display = 'block';

        // Zamknięcie formularza po kliknięciu przycisku "X"
        applyForm.querySelector('.close-button').addEventListener('click', () => {
            document.body.removeChild(applyForm);
        });

        // Stylizacja formularza
        applyForm.style.color = '#ffffff'; // Biały tekst
        applyForm.style.backgroundColor = '#0000ff'; // Niebieski
        applyForm.style.padding = '20px';
        applyForm.style.borderRadius = '10px';
        applyForm.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
        applyForm.style.position = 'fixed';
        applyForm.style.top = '50%';
        applyForm.style.left = '50%';
        applyForm.style.transform = 'translate(-50%, -50%)';
        applyForm.style.zIndex = '1000';

        // Stylizacja przycisku zamknięcia
        const closeButton = applyForm.querySelector('.close-button');
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = '#00ff00'; // Jaskrawo zielony
        closeButton.style.border = 'none';
        closeButton.style.color = '#000000';
        closeButton.style.fontSize = '1.5rem';
        closeButton.style.cursor = 'pointer';
    }

    // Sekcja Usługi
    const services = [
        { title: 'Usługa 1', location: 'Lokalizacja 1', description: 'Opis usługi 1' },
        { title: 'Usługa 2', location: 'Lokalizacja 2', description: 'Opis usługi 2' },
        { title: 'Usługa 3', location: 'Lokalizacja 3', description: 'Opis usługi 3' },
        { title: 'Usługa 4', location: 'Lokalizacja 4', description: 'Opis usługi 4' },
        { title: 'Usługa 5', location: 'Lokalizacja 5', description: 'Opis usługi 5' },
        { title: 'Usługa 6', location: 'Lokalizacja 6', description: 'Opis usługi 6' },
        { title: 'Usługa 7', location: 'Lokalizacja 7', description: 'Opis usługi 7' },
        { title: 'Usługa 8', location: 'Lokalizacja 8', description: 'Opis usługi 8' }
    ];

    const servicesPerPage = 4;
    let currentServicePage = 1;

    function displayServices(servicesToDisplay, page = 1) {
        const servicesList = document.querySelector('.uslugi-list');
        servicesList.innerHTML = '';
        const start = (page - 1) * servicesPerPage;
        const end = start + servicesPerPage;
        const paginatedServices = servicesToDisplay.slice(start, end);

        paginatedServices.forEach(service => {
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('uslugi-item');

            const serviceTitle = document.createElement('h3');
            serviceTitle.textContent = service.title;
            serviceItem.appendChild(serviceTitle);

            const serviceLocation = document.createElement('p');
            serviceLocation.innerHTML = `<span class="location-marker">📍</span>${service.location}`;
            serviceItem.appendChild(serviceLocation);

            const serviceDescription = document.createElement('div');
            serviceDescription.classList.add('uslugi-description');
            serviceDescription.textContent = service.description;
            serviceItem.appendChild(serviceDescription);

            servicesList.appendChild(serviceItem);
        });

        displayServicePagination(servicesToDisplay.length, page);
    }

    function displayServicePagination(totalServices, page) {
        const pagination = document.querySelector('.service-pagination');
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalServices / servicesPerPage);

        const prevButton = document.createElement('button');
        prevButton.textContent = '<-';
        prevButton.classList.add('service-page-button');
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (currentServicePage > 1) {
                currentServicePage--;
                displayServices(services, currentServicePage);
            }
        });
        pagination.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.classList.add('page-info');
        pageInfo.textContent = ` ${page} -> ${totalPages} `;
        pagination.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.textContent = '->';
        nextButton.classList.add('service-page-button');
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentServicePage < totalPages) {
                currentServicePage++;
                displayServices(services, currentServicePage);
            }
        });
        pagination.appendChild(nextButton);
    }

    displayServices(services, currentServicePage);
});

// Dodanie kodu do obsługi zapisu CV
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('stworz-cv-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        // Pobierz parametr szablonu z URL
        const urlParams = new URLSearchParams(window.location.search);
        const template = urlParams.get('template');
        formData.append('template', template);

        // Zapisz CV w pliku JSON
        fetch('src/save_cv.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Przekierowanie do strony płatności
                window.location.href = `payment.html?cv_id=${data.cv_id}`;
            } else {
                alert('Wystąpił błąd podczas zapisywania CV.');
            }
        })
        .catch(error => {
            console.error('Błąd:', error);
            alert('Wystąpił błąd podczas zapisywania CV.');
        });
    });
});