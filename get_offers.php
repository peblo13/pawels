<?php
$json_file_path = 'ue.json';

// Wczytaj dane z pliku JSON
$json_data = file_get_contents($json_file_path);
$jobs = json_decode($json_data, true)['jobs'];
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Oferty Pracy</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div id="job-listings">
        <?php
        if (!empty($jobs)) {
            foreach ($jobs as $job) {
                echo '<div class="job-square">';
                echo '<h3>' . htmlspecialchars($job["title"]) . '</h3>';
                echo '<p>' . htmlspecialchars($job["location"]) . '</p>';
                echo '<div class="job-description">';
                echo '<p>Rodzaj umowy: ' . htmlspecialchars($job["contract"]) . '</p>';
                echo '<p>Pracodawca: ' . htmlspecialchars($job["company"]) . '</p>';
                echo '<p>Dostępna od: ' . htmlspecialchars($job["available_from"]) . '</p>';
                echo '</div>';
                echo '</div>';
            }
        } else {
            // Dodaj puste kwadraty, gdy nie ma ofert pracy
            for ($i = 0; $i < 3; $i++) {
                echo '<div class="job-square">';
                echo '<h3>Brak ofert pracy</h3>';
                echo '<p>---</p>';
                echo '<div class="job-description">';
                echo '<p>Rodzaj umowy: ---</p>';
                echo '<p>Pracodawca: ---</p>';
                echo '<p>Dostępna od: ---</p>';
                echo '</div>';
                echo '</div>';
            }
        }
        ?>
    </div>
</body>
</html>