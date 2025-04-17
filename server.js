const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

app.post('/log', (req, res) => {
  const logEntry = `Otázka ${req.body.question}: ${req.body.answer}\n`;
  fs.appendFile('answers.log', logEntry, err => {
    if (err) {
      console.error("Chyba pri ukladaní:", err);
      res.status(500).send("Nepodarilo sa uložiť.");
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server beží na http://localhost:${PORT}`);
});
