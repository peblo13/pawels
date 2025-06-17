<?php
// filepath: /C:/serwer/htdocs/moj_projek/eCVjob.pl/src/save_cv.php

header('Content-Type: application/json');

// Pobranie danych z formularza
$imie = $_POST['imie'] ?? '';
$nazwisko = $_POST['nazwisko'] ?? '';
$email = $_POST['email'] ?? '';
$telefon = $_POST['telefon'] ?? '';
$adres = $_POST['adres'] ?? '';
$about = $_POST['about'] ?? '';
$szablon = $_POST['template'] ?? '';

// Sprawdzenie, czy plik JSON istnieje
$file = 'bazacv.json';
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

// Odczytanie istniejących danych z pliku JSON
$data = json_decode(file_get_contents($file), true);

// Dodanie nowego CV do danych
$new_cv = [
    'imie' => $imie,
    'nazwisko' => $nazwisko,
    'email' => $email,
    'telefon' => $telefon,
    'adres' => $adres,
    'about' => $about,
    'szablon' => $szablon
];
$data[] = $new_cv;

// Zapisanie zaktualizowanych danych do pliku JSON
if (file_put_contents($file, json_encode($data))) {
    echo json_encode(['success' => true, 'cv_id' => count($data) - 1]);
} else {
    echo json_encode(['success' => false, 'message' => 'Błąd podczas zapisywania CV']);
}
?>