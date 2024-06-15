require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const sheets = require("./sheets");
const OpenAI = require("openai");

const openai = new OpenAI();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/ask-gpt", async (req, res) => {
  try {
    const { userInput, conversationHistory = [] } = req.body;

    const sheetId = "1FmCcENL91NKx0-KaUUfoZAwa85lmZCAS_nGQYT1NwY4";
    const range = "Teste!A1:B10";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });
    const rows = response.data.values;

    let sheetData = "Here are the spreadsheet data:\n";
    rows.forEach((row) => {
      sheetData += row.join(", ") + "\n";
    });

    if (!conversationHistory.length) {
      conversationHistory.push({ role: "user", content: sheetData });
    }
    conversationHistory.push({ role: "user", content: userInput });

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that helps a small company analyzing spreadsheets",
        },
        ...conversationHistory,
      ],
    });

    const answer = chatResponse.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: answer });

    res.json({ answer, conversationHistory });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
