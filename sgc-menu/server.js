const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const MENU_FILE = path.join(DATA_DIR, 'menu.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// ── Ensure data directory and seed files exist ──────────────────
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MENU_FILE)) {
  // Seed with DEFAULT_MENU on first run
  const defaultMenu = require('./data/default-menu.json');
  fs.writeFileSync(MENU_FILE, JSON.stringify(defaultMenu, null, 2));
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── MENU API ─────────────────────────────────────────────────────

// GET /api/menu  → returns current menu
app.get('/api/menu', (req, res) => {
  try {
    const menu = JSON.parse(fs.readFileSync(MENU_FILE, 'utf8'));
    res.json(menu);
  } catch (e) {
    res.status(500).json({ error: 'Could not read menu' });
  }
});

// PUT /api/menu  → saves updated menu (admin only, protected by password check in client)
app.put('/api/menu', (req, res) => {
  try {
    const menu = req.body;
    if (!Array.isArray(menu)) return res.status(400).json({ error: 'Invalid menu format' });
    fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2));
    console.log(`[${new Date().toISOString()}] Menu updated (${menu.length} sections)`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Could not save menu' });
  }
});

// ── ORDERS API ───────────────────────────────────────────────────

// GET /api/orders  → returns all orders (admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Could not read orders' });
  }
});

// POST /api/orders  → log a new order
app.post('/api/orders', (req, res) => {
  try {
    const order = req.body;
    if (!order || !order.name || !Array.isArray(order.items)) {
      return res.status(400).json({ error: 'Invalid order' });
    }
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    order.id = order.id || Date.now().toString();
    order.timestamp = order.timestamp || new Date().toISOString();
    orders.unshift(order); // newest first
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    console.log(`[${new Date().toISOString()}] Order saved: ${order.name} — R${order.total} (${order.items.length} items)`);
    res.json({ ok: true, id: order.id });
  } catch (e) {
    res.status(500).json({ error: 'Could not save order' });
  }
});

// DELETE /api/orders  → clear all orders (admin)
app.delete('/api/orders', (req, res) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
    console.log(`[${new Date().toISOString()}] All orders cleared`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Could not clear orders' });
  }
});

// ── Serve index.html for all other routes ────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n⛳  Strand Golf Club Menu running at http://localhost:${PORT}`);
  console.log(`   Menu data: ${MENU_FILE}`);
  console.log(`   Orders:    ${ORDERS_FILE}\n`);
});
