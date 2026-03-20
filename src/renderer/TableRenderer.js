/**
 * TableRenderer.js — Top-Down 2D Style (Stardew-like)
 *
 * Draws tables as flat top-down objects.
 * No perspective squish — entity coordinates are used directly as screen coords.
 *
 * Supported types:
 *   'round2'  — round table seen from above with 2 chair cushions
 *   'square4' — square table seen from above with 4 chairs
 *   'long6'   — elongated locked table (placeholder)
 */

export class TableRenderer {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Table}  table
   * @param {number} [canvasH=640]
   */
  render(ctx, table, canvasH = 640) {
    // Top-down: use entity coords directly (no perspective squish)
    const sx = table.x;
    const sy = table.y;

    switch (table.type) {
      case 'round2':
        this._drawRound2(ctx, table, sx, sy, canvasH);
        break;
      case 'square4':
        this._drawSquare4(ctx, table, sx, sy, canvasH);
        break;
      case 'long6':
        this._drawLong6(ctx, table, sx, sy);
        break;
      default:
        this._drawRound2(ctx, table, sx, sy, canvasH);
    }
  }

  // ─── round2 ──────────────────────────────────────────────────────────────────

  _drawRound2(ctx, table, sx, sy, canvasH) {
    const r = Math.max(20, canvasH * 0.034);   // table top radius

    ctx.save();

    // ── Shadow ────────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.beginPath();
    ctx.ellipse(sx + 3, sy + 4, r, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Chair cushions (draw before table so table is on top) ─────────────────
    for (const seat of table.seats) {
      const cx = sx + seat.ox;
      const cy = sy + seat.oy;
      this._drawTopDownChair(ctx, cx, cy, seat.occupied, r * 0.44);
    }

    // ── Table top (circle) ────────────────────────────────────────────────────
    ctx.fillStyle   = '#8B6914';
    ctx.strokeStyle = '#5C4A1E';
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wood grain rings
    ctx.strokeStyle = 'rgba(255,220,120,0.30)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(sx - r * 0.15, sy - r * 0.10, r * 0.45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  _drawTopDownChair(ctx, cx, cy, occupied, r) {
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.ellipse(cx + 2, cy + 2, r, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cushion circle (top-down)
    ctx.fillStyle   = occupied ? '#C8A860' : '#F0DC9A';
    ctx.strokeStyle = '#B8943A';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cushion detail line
    ctx.strokeStyle = 'rgba(180,148,58,0.45)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // ─── square4 ─────────────────────────────────────────────────────────────────

  _drawSquare4(ctx, table, sx, sy, canvasH) {
    const hw = Math.max(22, canvasH * 0.036);  // half-width
    const hh = hw * 0.80;                       // half-height (slightly shorter)

    ctx.save();

    // ── Shadow ────────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    ctx.fillRect(sx - hw + 4, sy - hh + 4, hw * 2, hh * 2);

    // ── Chair cushions (draw before table so table is on top) ─────────────────
    for (const seat of table.seats) {
      const cx = sx + seat.ox;
      const cy = sy + seat.oy;
      this._drawTopDownChair(ctx, cx, cy, seat.occupied, hw * 0.38);
    }

    // ── Table surface ─────────────────────────────────────────────────────────
    ctx.fillStyle   = '#8B6914';
    ctx.strokeStyle = '#5C4A1E';
    ctx.lineWidth   = 2.5;
    ctx.fillRect(sx - hw, sy - hh, hw * 2, hh * 2);
    ctx.strokeRect(sx - hw, sy - hh, hw * 2, hh * 2);

    // Wood grain lines (horizontal)
    ctx.strokeStyle = 'rgba(255,220,120,0.28)';
    ctx.lineWidth   = 1.2;
    for (const t of [0.30, 0.55, 0.75]) {
      ctx.beginPath();
      ctx.moveTo(sx - hw * 0.85, sy - hh + hh * 2 * t);
      ctx.lineTo(sx + hw * 0.85, sy - hh + hh * 2 * t);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ─── long6 (locked) ──────────────────────────────────────────────────────────

  _drawLong6(ctx, table, sx, sy) {
    ctx.save();
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#999';
    ctx.lineWidth   = 3;
    ctx.strokeRect(sx - 62, sy - 22, 124, 44);
    ctx.restore();

    ctx.fillStyle = 'rgba(150,150,150,0.15)';
    ctx.fillRect(sx - 62, sy - 22, 124, 44);

    ctx.font      = "bold 13px 'Comic Sans MS', cursive";
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('🔒 解锁', sx, sy + 6);
  }
}
