# 微微咖啡馆 ☕ — Weiwei Coffee Shop

> A browser-based cartoon-style cafe management game — built with love 💕

---

## 🇨🇳 游戏介绍

欢迎来到**微微咖啡馆**！

你是一家温馨咖啡馆的老板，客人陆续进门、落座、点单，你需要接单、制作、上菜，让客人满意地离开并付钱。偶尔还会有来自抖音的网红主播神秘现身，带来超级小费！

## 🇬🇧 Description

Welcome to **Weiwei Coffee Shop** — a cute cartoon cafe management game!

Customers walk in, find a table, order coffee and food. You click on waiting customers to take their order, prepare it at the coffee machine, then serve it. Happy customers pay up and leave, growing your earnings. Watch out for special TikTok streamer guests — they leave huge tips! 🌟

---

## 🎮 How to Play

1. **Open** `index.html` directly in **Google Chrome** (no server needed)
2. **Wait** for customers to walk in and sit down (~4–10 seconds)
3. **Watch** for the **`!`** marker above a customer — it means they're waiting for you!
4. **Click** on a waiting customer to open the Order Panel
5. **Click "Prepare ☕"** to start making their drink/food at the counter
6. **Wait** for the progress bar to fill up (shown near the counter)
7. **Click the customer again → "Serve 🍽️"** to deliver their order
8. Customer eats, pays, and leaves — your **💰 money** increases!
9. If you're too slow, the customer may leave without paying 😢

### Special Guests
- **📱 TikTok Streamers** — glow gold, say famous quotes, leave huge tips!
- **👑 VIP Customers** — generous tippers with short patience
- **🧐 Food Critics** — highest tips but hard to impress

---

## 📁 Project Structure

```
weiwei-coffee-shop-game/
├── index.html              ← Open this in Chrome to play!
├── README.md
└── src/
    ├── core/
    │   ├── Game.js         ← Main game class + input handling
    │   └── GameLoop.js     ← requestAnimationFrame loop
    ├── entities/
    │   ├── Customer.js     ← Customer state machine
    │   ├── Table.js        ← Table + seat management
    │   └── Order.js        ← Order data + prep timer
    ├── systems/
    │   ├── CustomerSystem.js  ← Spawning + lifecycle management
    │   ├── OrderSystem.js     ← Order queue + prep tracking
    │   └── EconomySystem.js   ← Money + floating text animations
    ├── data/
    │   └── MenuData.js     ← Menu items, streamers, special customers
    ├── ui/
    │   ├── HUD.js          ← Bottom bar: money, title, phase
    │   ├── OrderPanel.js   ← Popup when clicking a waiting customer
    │   └── ChatBubble.js   ← Speech bubbles above customers
    └── renderer/
        ├── CafeRenderer.js     ← Cafe background, counter, plants
        ├── TableRenderer.js    ← Tables + chairs
        └── CustomerRenderer.js ← Cartoon customer characters
```

---

## 🗺️ Phase Roadmap

| Phase | Features | Status |
|-------|----------|--------|
| **Phase 1 — MVP** | Core game loop, 2 tables, 3 menu items, chat bubbles, TikTok Easter egg | ✅ Done |
| **Phase 2 — Equipment & Menu** | Equipment shop, unlock new menu items, buy more tables, different table styles | ⏳ Planned |
| **Phase 3 — Staff & Special Customers** | Hire waiters & baristas, more special guests, patience meters | ⏳ Planned |
| **Phase 4 — Decoration & Expansion** | Expand cafe, decorate walls/floors, save/load progress | ⏳ Planned |

---

## 🛠️ Tech Stack

| Tool | Usage |
|------|-------|
| HTML5 Canvas 2D | All rendering — no image files needed |
| ES Modules (`type="module"`) | Clean modular JavaScript |
| `requestAnimationFrame` | Smooth 60 fps game loop |
| No build tools | Open `index.html` directly — zero setup |

---

## 🚀 Quick Start

```bash
# Just open the file in Chrome:
open index.html     # macOS
start index.html    # Windows
xdg-open index.html # Linux
```

Or drag `index.html` into your Chrome browser window.

---

*Made with ❤️ for 微微*

