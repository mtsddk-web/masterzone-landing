# 📊 Exit Survey Google Sheets Integration - Setup Guide

## Krok 1: Utwórz Google Sheet

1. Otwórz Google Drive
2. Znajdź istniejący plik **"Obecność"** lub utwórz nowy Google Sheet
3. Dodaj nowy arkusz (Sheet) o nazwie **"Exit Survey"**
4. Dodaj nagłówki w pierwszym wierszu:
   - A1: `Data`
   - B1: `Godzina`
   - C1: `Powód`
   - D1: `URL Strony`
   - E1: `Timestamp`

## Krok 2: Utworz Google Apps Script Webhook

1. W Google Sheet kliknij **Extensions → Apps Script**
2. Usuń domyślny kod i wklej poniższy:

```javascript
function doPost(e) {
  try {
    // Parse JSON body
    const data = JSON.parse(e.postData.contents);

    // Get active spreadsheet and Exit Survey sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Exit Survey');

    // If sheet doesn't exist, create it
    if (!sheet) {
      const newSheet = ss.insertSheet('Exit Survey');
      newSheet.appendRow(['Data', 'Godzina', 'Powód', 'URL Strony', 'Timestamp']);
    }

    const exitSheet = ss.getSheetByName('Exit Survey');

    // Append new row with data
    exitSheet.appendRow([
      data.date || new Date().toLocaleDateString('pl-PL'),
      data.time || new Date().toLocaleTimeString('pl-PL'),
      data.reason || 'Unknown',
      data.url || 'Unknown',
      data.timestamp || new Date().toISOString()
    ]);

    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Kliknij **Save** (ikona dyskietki)
4. Kliknij **Deploy → New deployment**
5. Wybierz **Web app** jako typ
6. Ustawienia:
   - **Execute as**: Me (twoje konto)
   - **Who has access**: Anyone
7. Kliknij **Deploy**
8. **Skopiuj Web App URL** - będzie wyglądał jak:
   ```
   https://script.google.com/macros/s/AKfycbz...../exec
   ```

## Krok 3: Dodaj Webhook URL do Environment Variables

1. W projekcie Next.js, utwórz/edytuj plik `.env.local`:
   ```bash
   EXIT_SURVEY_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

2. Zastąp `YOUR_SCRIPT_ID` swoim rzeczywistym URL z kroku 2.8

3. **Restart dev server** żeby załadować nową zmienną:
   ```bash
   # Zatrzymaj npm run dev (Ctrl+C)
   npm run dev
   ```

## Krok 4: Test

1. Otwórz stronę w trybie incognito
2. Najedź kursorem na górę okna przeglądarki (symulacja exit intent)
3. Wypełnij ankietę exit survey
4. Kliknij "Wyślij opinię"
5. Sprawdź Google Sheet **"Exit Survey"** - powinna pojawić się nowa linia z danymi

## Troubleshooting

### Problem: "Webhook not configured"
- Sprawdź czy `.env.local` istnieje i zawiera `EXIT_SURVEY_WEBHOOK_URL`
- Zrestartuj `npm run dev`

### Problem: "403 Forbidden" w console
- W Apps Script deployment upewnij się że **"Who has access"** jest ustawione na **"Anyone"**
- Redeploy Web App

### Problem: Dane nie trafiają do Sheet
- Sprawdź nazwę arkusza - musi być dokładnie **"Exit Survey"**
- Sprawdź czy Google Apps Script nie ma błędów (Extensions → Apps Script → View → Logs)
- Zweryfikuj że webhook URL jest poprawny (kończy się na `/exec`)

## Format Danych w Google Sheet

Każdy exit survey zapisze:
- **Data**: np. "26.11.2025"
- **Godzina**: np. "13:45:30"
- **Powód**: Wybrany powód lub custom text z "inne"
- **URL Strony**: Pełny URL gdzie user był
- **Timestamp**: ISO timestamp dla dokładności

## Możliwe Powody w Ankiecie

1. `price` - "Za drogo - $14/msc to za dużo"
2. `not-for-me` - "To nie dla mnie / Nie potrzebuję tego"
3. `no-time` - "Nie mam teraz czasu / Wrócę później"
4. `need-more-info` - "Potrzebuję więcej informacji"
5. `other` - Custom text wpisany przez użytkownika

## Analiza Danych

Po zebraniu danych możesz:
1. **Pivot Table** w Google Sheets - grupuj po "Powód" żeby zobaczyć najczęstsze przyczyny exit
2. **Export do CSV** - analizuj w Excel/Python
3. **Dashboard** - użyj Google Data Studio do wizualizacji

---

**STATUS:** ✅ Exit Survey Integration GOTOWA - gotowa do testowania po skonfigurowaniu webhook URL
