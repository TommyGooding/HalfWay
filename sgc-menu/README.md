# Strand Golf Club – Halfway House Menu

A self-contained Node.js web app. Menu edits go live instantly for all users. Orders are saved on the server.

---

## Quick Start

### Requirements
- [Node.js](https://nodejs.org) v18 or higher

### 1. Install & Run

```bash
cd sgc-menu
npm install
npm start
```

The app will be available at **http://localhost:3000**

---

## Deployment Options

### Option A – Simple VPS / Linux Server

```bash
# Install Node.js if needed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Upload the sgc-menu folder to your server, then:
cd sgc-menu
npm install
npm start
```

To keep it running after you close SSH, use [PM2](https://pm2.keymetrics.io/):

```bash
npm install -g pm2
pm2 start server.js --name sgc-menu
pm2 save
pm2 startup   # follow the printed command to auto-start on reboot
```

### Option B – Railway / Render / Fly.io (free tiers available)

1. Push the `sgc-menu` folder to a GitHub repo
2. Connect it to [Railway](https://railway.app), [Render](https://render.com), or [Fly.io](https://fly.io)
3. Set start command: `node server.js`
4. Deploy — done.

> ⚠️ **Note on free cloud hosts:** Some free tiers have ephemeral file systems (data resets on redeploy). For persistent storage, use a paid tier or attach a volume/disk.

---

## Data Files

All data lives in the `data/` folder:

| File | Contents |
|------|----------|
| `data/menu.json` | Live menu — updated when admin saves |
| `data/orders.json` | All orders, newest first |
| `data/default-menu.json` | Seed menu used only on first launch |

**Backup tip:** Copy `data/` regularly, or mount it as a persistent volume in Docker/cloud deployments.

---

## Configuration

Edit these values in `public/index.html` (search for them):

```js
const WHATSAPP_NUMBER = '27615142620';  // Your WhatsApp number (no + or spaces)
const ADMIN_PASSWORD  = 'sgc2024';      // ← Change this!
```

To change the port, set the `PORT` environment variable:

```bash
PORT=8080 npm start
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/menu` | Fetch current menu |
| PUT | `/api/menu` | Save updated menu (admin) |
| GET | `/api/orders` | Fetch all orders (admin) |
| POST | `/api/orders` | Log a new order |
| DELETE | `/api/orders` | Clear all orders (admin) |
