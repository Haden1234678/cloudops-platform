const express = require('express');
const { Pool } = require('pg');
const fs = require('node:fs/promises');
const path = require('node:path');

const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: DATABASE_URL });

const CHECK_TIMEOUT_MS = 2000;

// Run a promise, but give up after `ms` milliseconds.
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

const checks = [
  {
    name: 'api',
    async run() {
      // Reaching this line proves the process is alive and handling requests.
    },
  },
  {
    name: 'frontend',
    async run() {
      const filePath = path.join(__dirname, 'public', 'index.html');
      await fs.access(filePath, fs.constants.R_OK);
    },
  },
];

async function runCheck(check) {
  const startedAt = Date.now();
  try {
    await withTimeout(check.run(), CHECK_TIMEOUT_MS);
    return { name: check.name, status: 'up', latencyMs: Date.now() - startedAt };
  } catch (error) {
    return {
      name: check.name,
      status: 'down',
      latencyMs: Date.now() - startedAt,
      error: error.message,
    };
  }
}

async function testDatabase() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected. Current time:', result.rows[0].now);
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/services', async (req, res) => {
  const services = await Promise.all(checks.map((check) => runCheck(check)));
  res.json({ checkedAt: new Date().toISOString(), services });
});

testDatabase();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});