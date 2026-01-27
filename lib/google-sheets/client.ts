import { google } from 'googleapis';

// Initialize Google Sheets client
export async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Fetch data from Google Sheet
export async function fetchSheetData(): Promise<string[][]> {
  const sheets = await getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID environment variable is not set');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Doctors!A:O', // Columns A through O
  });

  const rows = response.data.values;

  if (!rows || rows.length === 0) {
    return [];
  }

  return rows;
}
