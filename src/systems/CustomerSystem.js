/**
 * CustomerSystem.js
 * Spawns and manages all customers in the cafe.
 *
 * Spawn rules:
 *  - New customer every 8–12 seconds (random), scaled by spawnRateMultiplier
 *  - 10 % chance the customer is a TikTok streamer
 *  - 5 % chance the customer is a special customer (VIP / critic / birthday etc.)
 *  - Otherwise: normal customer with random name + pastel color
 *  - Max 8 customers on screen at once
 *  - If no table is available, customer never enters
 *  - spawnEnabled = false prevents new spawns (e.g. CLOSING phase)
 */

import { Customer, STATE } from '../entities/Customer.js';
import {
  STREAMERS, SPECIAL_CUSTOMERS,
  NORMAL_NAMES, PASTEL_COLORS,
} from '../data/MenuData.js';

export class CustomerSystem {
  /**
   * @param {Table[]}  tables  - Array of Table instances
   * @param {number}   canvasH - Canvas height (for spawn Y range)
   * @param {number}   canvasW - Canvas width (for exit target calculation)
   */
  constructor(tables, canvasH, canvasW = 1280) {
    this.tables       = tables;
    this.canvasH      = canvasH;
    this.canvasW      = canvasW;
    this.customers    = [];
    this._spawnTimer  = 4; // first customer arrives after 4 s
    this._spawnDelay  = 8 + Math.random() * 4;
    this._groupSeq    = 0; // counter for unique group IDs

    /** Set false to block new spawns (e.g. CLOSING / SUMMARY phase). */
    this.spawnEnabled = true;

    /** Bonus seconds added to every new customer's patience (from upgrades). */
    this.patienceBonus = 0;

    /** Multiplier applied to spawn rate from reputation system. */
    this.spawnRateMultiplier = 1.0;

    /** Tip multiplier from reputation system. */
    this.tipMultiplier = 1.0;

    /** Sound effect callback set by Game. */
    this.onSound = null;

    /** Callback fired when a streamer spawns — used by Game for the banner. */
    this.onStreamerSpawn = null;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /** Find a customer by ID. */
  getById(id) {
    return this.customers.find((c) => c.id === id) ?? null;
  }

  // ─── Update ─────────────────────────────────────────────────────────────────

  /**
   * @param {number} dt      - delta time in seconds
   * @param {Object} systems - { orderSystem, economySystem, reputationSystem, goalSystem }
   */
  update(dt, systems) {
    // Update each existing customer
    for (const c of this.customers) {
      c.update(dt, systems);
    }

    // Remove customers that have fully left
    this.customers = this.customers.filter((c) => c.state !== STATE.GONE);

    // Spawn timer — only counts down when spawning is enabled
    if (this.spawnEnabled) {
      this._spawnTimer -= dt;
      if (this._spawnTimer <= 0) {
        this._spawnTimer = this._spawnDelay;
        // Scale spawn delay by reputation rate multiplier (higher rep = shorter delay)
        this._spawnDelay = (8 + Math.random() * 4) / Math.max(0.1, this.spawnRateMultiplier);
        this._trySpawn();
      }
    }
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _trySpawn() {
    if (this.customers.length >= 8) return; // max customers on screen

    // Each customer arrives alone — assign a unique group ID
    const groupId = `group_${++this._groupSeq}`;

    // Find an available table + seat (must be empty or same group)
    const table = this.tables.find((t) => t.isAvailableForGroup(groupId));
    if (!table) return; // no room — customer doesn't enter

    const seatIdx = table.getSeat();

    // Decide customer type
    const roll = Math.random();
    let customer;

    if (roll < 0.10) {
      // Streamer
      const data = STREAMERS[Math.floor(Math.random() * STREAMERS.length)];
      customer = this._makeCustomer({
        name       : data.name,
        color      : data.color,
        emoji      : '📱',
        isStreamer : true,
        tip        : data.tip,
        quotes     : [...data.quotes],
        platform   : data.platform,
        groupId,
      });
      customer.sparkleTimer = 5; // golden sparkle on entry
      if (this.onStreamerSpawn) this.onStreamerSpawn(customer);

    } else if (roll < 0.15) {
      // Special customer
      const data = SPECIAL_CUSTOMERS[Math.floor(Math.random() * SPECIAL_CUSTOMERS.length)];
      const emoji = data.id === 'vip' ? '👑'
                  : data.id === 'birthday' ? '🎂'
                  : data.id === 'blogger' ? '📸'
                  : data.id === 'family' ? '👨‍👧'
                  : '🧐';
      customer = this._makeCustomer({
        name         : data.name,
        color        : data.color,
        emoji,
        isSpecial    : true,
        tip          : data.tip ?? 0,
        quotes       : data.quotes ? [...data.quotes] : [],
        isBirthday   : data.isBirthday   ?? false,
        isBlogger    : data.isBlogger    ?? false,
        isFamily     : data.isFamily     ?? false,
        angryPenalty : data.angryPenalty ?? 0,
        requiresItem : data.requiresItem ?? null,
        groupId,
      });

    } else {
      // Normal customer
      const name  = NORMAL_NAMES[Math.floor(Math.random() * NORMAL_NAMES.length)];
      const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
      customer = this._makeCustomer({ name, color, emoji: '😊', groupId });
    }

    // Spawn position: left edge, random Y in the cafe floor area
    const floorTop    = this.canvasH * 0.30;
    const floorBottom = this.canvasH - 100;
    customer.x       = -30;
    customer.y       = floorTop + Math.random() * (floorBottom - floorTop);

    // Walk to just in front of the table as the WALKING_IN destination
    customer.targetX  = table.x - 60;
    customer.targetY  = table.y;

    // Reserve the seat immediately so nobody else takes it
    table.occupy(seatIdx, customer);
    customer.assignedTable = table;
    customer.assignedSeat  = seatIdx;

    this.customers.push(customer);
  }

  /** Build a Customer with system-level defaults applied. */
  _makeCustomer(options) {
    const c = new Customer({ ...options, canvasWidth: this.canvasW });
    c.patience      += this.patienceBonus;
    c.tipMultiplier  = this.tipMultiplier;
    c.onSound        = this.onSound;
    return c;
  }
}
