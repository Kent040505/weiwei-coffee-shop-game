/**
 * MenuData.js
 * Static data for menu items, TikTok streamer Easter eggs, and special customers.
 * All data is exported as constants for use throughout the game.
 */

// ─── Menu Items ──────────────────────────────────────────────────────────────
export const MENU_ITEMS = [
  { id: 'americano', name: 'Americano ☕', price: 8,  prepTime: 5,  emoji: '☕', color: '#8B4513' },
  { id: 'latte',     name: 'Latte 🥛',    price: 12, prepTime: 8,  emoji: '🥛', color: '#D2B48C' },
  { id: 'croissant', name: 'Croissant 🥐', price: 6, prepTime: 3,  emoji: '🥐', color: '#DAA520' },
];

// ─── TikTok Streamer Easter Eggs ─────────────────────────────────────────────
export const STREAMERS = [
  {
    id: 'sangye',
    name: '桑杰',
    platform: '抖音',
    color: '#FF6B9D',  // pink
    quotes: [
      '哥哥们，点个关注！',
      '今天吃什么？',
      '主播饿了！打钱！',
      '这咖啡绝了！',
      '老板！再来一杯！',
    ],
    isStreamer: true,
    tip: 50,
  },
  {
    id: 'liziqi',
    name: '李子柒',
    platform: '抖音',
    color: '#90EE90',  // soft green
    quotes: [
      '田园生活真美好～',
      '这咖啡香气扑鼻',
      '用心做每一件事',
    ],
    isStreamer: true,
    tip: 40,
  },
];

// ─── Special Customers ────────────────────────────────────────────────────────
export const SPECIAL_CUSTOMERS = [
  { id: 'vip',    name: 'VIP客人',   color: '#FFD700', tip: 20, quotes: ['服务不错！', '给你好评！'] },
  { id: 'critic', name: '美食评论家', color: '#9370DB', tip: 30, quotes: ['嗯...还行', '有点意思'] },
];

// ─── Normal Customer Name Pool ────────────────────────────────────────────────
export const NORMAL_NAMES = ['小明', '小红', '阿华', '小兰', '大宝', '小雪', '阿龙', '小慧', '大毛', '小鱼'];

// ─── Normal Customer Pastel Colors ───────────────────────────────────────────
export const PASTEL_COLORS = [
  '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
  '#E8BAFF', '#FFB3F7', '#B3FFEC', '#FFD9B3', '#C9B3FF',
];

// ─── Happy eating quotes (shown during EATING state) ─────────────────────────
export const HAPPY_QUOTES = [
  '好吃！😋', '太香了！', '再来一份！', '五星好评！⭐',
  '美味！', '不错不错～', '老板手艺好！', '幸福～',
];
