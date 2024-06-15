const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: './apichatgptconnector-51956c948841.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = sheets;
