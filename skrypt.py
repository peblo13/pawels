import csv
import json

# Ścieżki do plików
csv_file_path = r'C:\serwer\htdocs\moj_projek\eCVjob.pl\src\oe.csv'
json_file_path = r'C:\serwer\htdocs\moj_projek\eCVjob.pl\src\ue.json'

# Wczytaj dane z pliku CSV
jobs = []
with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
    csv_reader = csv.DictReader(csv_file, delimiter=';')
    
    # Wyświetl nagłówki pliku CSV
    headers = csv_reader.fieldnames
    print(f'Nagłówki pliku CSV: {headers}')
    
    for row in csv_reader:
        job = {
            "title": row["\ufeffStanowisko"].strip(' "'),
            "location": row[" Miejsce pracy"].strip(' "'),
            "contract": row[" Rodzaj umowy"].strip(' "'),
            "company": row[" Pracodawca"].strip(' "'),
            "available_from": row[" Dostępna od"].strip(' "')
        }
        jobs.append(job)

# Zapisz dane do pliku JSON
with open(json_file_path, mode='w', encoding='utf-8') as json_file:
    json.dump({"jobs": jobs}, json_file, ensure_ascii=False, indent=4)

print(f'Dane zostały zapisane do pliku {json_file_path}')