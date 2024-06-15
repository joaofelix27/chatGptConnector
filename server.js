require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sheets = require('./sheets');
const OpenAI = require('openai');

const openai = new OpenAI();

const app = express();
const port = 3000;

app.use(bodyParser.json());


app.post('/ask-gpt', async (req, res) => {
  try {
    const { userInput } = req.body;

    const sheetId = '1FmCcENL91NKx0-KaUUfoZAwa85lmZCAS_nGQYT1NwY4';
    const range = 'Teste!A1:B10';
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });
    const rows = response.data.values;

    let sheetData = 'Here are the spreadsheet data:\n';
    rows.forEach(row => {
      sheetData += row.join(', ') + '\n';
    });

    const chatResponse = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: userInput },
            { role: 'user', content: sheetData },
          ],
        model: "gpt-4o",
      });

      debugger
    const answer = chatResponse.choices[0].message.content;

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
