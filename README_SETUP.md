# ARBBS Services Website (Static)

## What's included
- Home: `index.html`
- Packages + Stripe placeholders: `plans.html`
- Sign-up form: `signup.html`
  - Submits to **Google Sheets** after you paste your Apps Script Web App URL into `assets/app.js`
  - If you don't set the URL, it automatically falls back to WhatsApp submission
- Contact: `contact.html`

## Add your Stripe Payment Links
Search and replace these placeholders in the HTML + JS:
- `YOUR_STRIPE_LINK_5MBPS`
- `YOUR_STRIPE_LINK_10MBPS`
- `YOUR_STRIPE_LINK_15MBPS`
- `YOUR_STRIPE_LINK_25MBPS`

## Google Sheets sign-up (Apps Script)
1) Create a Google Sheet, add headers:
Timestamp, Full Name, Phone, Email, Address, Package, Preferred Install Time, Notes

2) Extensions -> Apps Script -> paste:

```js
const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.fullName || "",
      data.phone || "",
      data.email || "",
      data.address || "",
      data.plan || "",
      data.install || "",
      data.notes || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3) Deploy -> New deployment -> Web app
- Execute as: Me
- Who has access: Anyone
- Copy the Web App URL

4) Paste URL into: `assets/app.js`
Replace:
`PASTE_YOUR_WEB_APP_URL_HERE`

## Hosting
- Netlify: drag-and-drop the folder
- GitHub Pages: upload to repo and enable Pages
- Any cPanel hosting: upload files to `public_html/`
