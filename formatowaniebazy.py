import csv
import json
import os

# Ścieżki do plików
csv_file_path = 'C:/serwer/htdocs/moj_projek/eCVjob.pl/src/oe.csv'
json_file_path = 'C:/serwer/htdocs/moj_projek/eCVjob.pl/src/jakmabyc.json'

# Funkcja do konwersji CSV na JSON
def csv_to_json(csv_file_path, json_file_path):
    data = []
    
    # Otwórz plik CSV i odczytaj dane
    with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter=';')
        for row in csv_reader:
            # Dodaj dane do listy w odpowiednim formacie
            data.append({
                "title": row["Stanowisko"].strip(),
                "location": row["Miejsce pracy"].strip(),
                "description": row["Rodzaj umowy"].strip()
            })
    
    # Zapisz dane do pliku JSON
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)

# Wykonaj konwersję
csv_to_json(csv_file_path, json_file_path)

print(f"Plik JSON został zapisany w: {json_file_path}")