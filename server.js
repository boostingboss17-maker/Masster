const express = require('express');
const bodyParser = require('body-parser');

// In-memory storage (placeholder)
const reportsStore = [];

// Server-side sanitization
function sanitizeUsername(input) {
  if (!input) return '';
  let sanitized = String(input).trim();
  if (sanitized.startsWith('@')) {
    sanitized = sanitized.substring(1);
  }
  sanitized = sanitized.toLowerCase();
  return sanitized;
}

function isValidUsername(sanitized) {
  return /^[a-z0-9._]{1,30}$/.test(sanitized);
}

const app = express();
app.use(bodyParser.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Report endpoint
app.post('/api/report', (req, res) => {
  const { username, reports } = req.body || {};
  const sanitized = sanitizeUsername(username || '');

  if (!sanitized || !isValidUsername(sanitized)) {
    return res.status(400).json({
      error: 'Invalid username — use only letters, numbers, periods, or underscores and 1–30 characters.',
    });
  }

  // Store only sanitized lowercase without leading @
  const record = {
    username: sanitized,
    reports: Array.isArray(reports) ? reports : [],
    receivedAt: new Date().toISOString(),
  };
  reportsStore.push(record);

  res.json({
    success: true,
    storedUsername: sanitized,
    reportCount: record.reports.length,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;