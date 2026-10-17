const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const services = [
  { name: 'api', status: 'up' },
  { name: 'database', status: 'up' },
  { name: 'frontend', status: 'up' },
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});