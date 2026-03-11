/**
 * EconomySystem.js
 * Tracks the player's money, handles spending/earning, and drives
 * the floating "+$X" text animations that appear on screen.
 */

export class EconomySystem {
  constructor() {
    this.money   = 50;         // starting money
    this._floats = [];         // floating text animations
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * Add money and spawn a floating "+$X" animation.
   * @param {number} amount - Amount to add
   * @param {number} x      - Canvas X where the float starts
   * @param {number} y      - Canvas Y where the float starts
   */
  addMoney(amount, x = 400, y = 300) {
    this.money += amount;
    this._floats.push({
      text  : `+$${amount}`,
      x,
      y,
      alpha : 1,
      vy    : -60, // pixels per second upward
    });
  }

  /**
   * Spend money.  Returns false if insufficient funds (does NOT deduct).
   * @param {number} amount
   * @returns {boolean}
   */
  spendMoney(amount) {
    if (this.money < amount) return false;
    this.money -= amount;
    return true;
  }

  // ─── Update / Render ─────────────────────────────────────────────────────────

  /**
   * Advance float animations.
   * @param {number} dt - delta time in seconds
   */
  update(dt) {
    for (const f of this._floats) {
      f.y     += f.vy * dt;
      f.alpha -= dt * 0.6; // fade over ~1.7 s
    }
    // Remove fully faded floats
    this._floats = this._floats.filter((f) => f.alpha > 0);
  }

  /**
   * Draw all active floating money texts.
   * @param {CanvasRenderingContext2D} ctx
   */
  render(ctx) {
    ctx.save();
    ctx.font      = "bold 22px 'Comic Sans MS', cursive";
    ctx.textAlign = 'center';

    for (const f of this._floats) {
      ctx.globalAlpha = Math.max(0, f.alpha);
      // Shadow for readability
      ctx.fillStyle = '#000';
      ctx.fillText(f.text, f.x + 1, f.y + 1);
      // Gold text
      ctx.fillStyle = '#FFD700';
      ctx.fillText(f.text, f.x, f.y);
    }

    ctx.restore();
  }
}
