const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

const cooldownFile = 'cooldown.json'; // tu budeme ukladať cooldowny

app.use(express.static(__dirname));
app.use(express.json());

// Ukladanie odpovedí do answers.log
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

// Uloženie cooldownu na 24 hodín
app.post('/saveCooldown', (req, res) => {
  const ip = req.ip;
  const unlockTime = Date.now() + 24 * 60 * 60 * 1000; // teraz + 24h

  let cooldowns = {};
  if (fs.existsSync(cooldownFile)) {
    cooldowns = JSON.parse(fs.readFileSync(cooldownFile));
  }

  cooldowns[ip] = unlockTime;
  fs.writeFileSync(cooldownFile, JSON.stringify(cooldowns));
  res.send({ success: true });
});

// Overenie cooldownu
app.get('/checkCooldown', (req, res) => {
  const ip = req.ip;
  let unlockTime = 0;

  if (fs.existsSync(cooldownFile)) {
    const cooldowns = JSON.parse(fs.readFileSync(cooldownFile));
    unlockTime = cooldowns[ip] || 0;
  }

  res.send({ unlockTime });
});

app.listen(PORT, () => {
  console.log(`🟢 Server beží na http://localhost:${PORT}`);
});
