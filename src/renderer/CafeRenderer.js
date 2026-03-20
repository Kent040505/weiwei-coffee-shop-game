/**
 * CafeRenderer.js — Top-Down Tile-Based Cafe View (Stardew-like)
 *
 * Draws the cafe interior from a top-down orthographic perspective:
 *   - Warm cream background (outside/street area)
 *   - Back wall (top strip) with heart wallpaper, windows, coffee counter
 *   - Left/right side walls with door on the left (customer entrance)
 *   - Square tile floor grid (warm wood tones, checkerboard pattern)
 *   - Corner plants on the floor
 *   - Optional sky-tint overlay (dusk/night effect)
 *
 * Floor geometry (all responsive to canvas W × H):
 *   floorLeft(W)   = W * 0.03   — left edge of playable floor
 *   floorTop(H)    = H * 0.28   — top edge of floor / bottom of back wall
 *   floorRight(W)  = W * 0.97   — right edge of playable floor
 *   floorBottom(H) = H * 0.90   — bottom edge of floor / entrance threshold
 *
 * Exported helpers:
 *   floorLeft(W), floorTop(H), floorRight(W), floorBottom(H)
 */

import { roundRect as _roundRect } from '../utils/drawUtils.js';

/** Left edge of the playable floor area. */
export function floorLeft(W)   { return W * 0.03; }
/** Top edge of the playable floor area (bottom of back wall). */
export function floorTop(H)    { return H * 0.28; }
/** Right edge of the playable floor area. */
export function floorRight(W)  { return W * 0.97; }
/** Bottom edge of the playable floor area. */
export function floorBottom(H) { return H * 0.90; }

export class CafeRenderer {
  constructor(w, h) {
    this.w = w;
    this.h = h;
  }

  render(ctx, skyTint = null) {
    const W = this.w;
    const H = this.h;

    const fL = floorLeft(W);
    const fT = floorTop(H);
    const fR = floorRight(W);
    const fB = floorBottom(H);
    const fW = fR - fL;
    const fH = fB - fT;

    // Wall thickness for left/right side walls
    const sideWallW = Math.max(6, W * 0.018);
    // Back wall height (strip above floor)
    const backWallH = fT - H * 0.06;

    // ── A. Background (outside/street area) ───────────────────────────────────
    this._drawBackground(ctx, W, H, fT);

    // ── B. Back wall ──────────────────────────────────────────────────────────
    this._drawBackWall(ctx, W, H, fL, fT, fR, backWallH);

    // ── C. Square tile floor ──────────────────────────────────────────────────
    this._drawFloor(ctx, fL, fT, fW, fH);

    // ── D. Side walls (drawn over floor edges) ────────────────────────────────
    this._drawSideWalls(ctx, W, H, fL, fT, fR, fB, sideWallW);

    // ── E. Door on left wall (customer entrance) ──────────────────────────────
    this._drawDoor(ctx, W, H, fL, fT, fB, sideWallW);

    // ── F. Counter and windows on back wall ───────────────────────────────────
    this._drawCounter(ctx, W, H, fL, fT, fR, backWallH);
    this._drawWindows(ctx, W, H, fL, fT, fR, backWallH);

    // ── G. Corner plants on the floor ─────────────────────────────────────────
    this._drawPlants(ctx, H, fL, fR, fT, fB);

    // ── H. Sky tint overlay ───────────────────────────────────────────────────
    if (skyTint) {
      ctx.save();
      ctx.fillStyle = skyTint;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  // ─── A. Background ──────────────────────────────────────────────────────────

  _drawBackground(ctx, W, H, fT) {
    ctx.save();

    // Warm cream — outside / street area fills entire canvas as a base
    ctx.fillStyle = '#FFF0D9';
    ctx.fillRect(0, 0, W, H);

    // Subtle sidewalk pattern outside (below floor bottom)
    ctx.fillStyle = '#EEE0C8';
    ctx.fillRect(0, H * 0.90, W, H * 0.10);
    ctx.strokeStyle = '#D4C0A0';
    ctx.lineWidth   = 1;
    ctx.strokeRect(0, H * 0.90, W, H * 0.10);

    // Heart wallpaper decoration above the back wall
    ctx.font      = '13px serif';
    ctx.fillStyle = 'rgba(255,182,193,0.35)';
    for (let px = 18; px < W; px += 52) {
      for (let py = 16; py < fT * 0.72; py += 36) {
        ctx.fillText('♥', px, py);
      }
    }

    ctx.restore();
  }

  // ─── B. Back wall (top strip) ───────────────────────────────────────────────

  _drawBackWall(ctx, W, H, fL, fT, fR, backWallH) {
    ctx.save();

    const wallTop = fT - backWallH;

    // Left half of back wall
    ctx.fillStyle = '#EDD5B0';
    ctx.fillRect(fL, wallTop, (fR - fL) * 0.5, backWallH);

    // Right half (slightly different tone)
    ctx.fillStyle = '#DCC89A';
    ctx.fillRect(fL + (fR - fL) * 0.5, wallTop, (fR - fL) * 0.5, backWallH);

    // Bottom border of back wall (separates wall from floor)
    ctx.strokeStyle = '#B89060';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(fL, fT);
    ctx.lineTo(fR, fT);
    ctx.stroke();

    // Top border
    ctx.strokeStyle = '#C8A070';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(fL, wallTop);
    ctx.lineTo(fR, wallTop);
    ctx.stroke();

    ctx.restore();
  }

  // ─── C. Square tile floor ───────────────────────────────────────────────────

  _drawFloor(ctx, fL, fT, fW, fH) {
    // Square tile size — auto-fit to floor dimensions (10 columns target)
    const tileSize = Math.min(fW / 10, fH / 7);
    const cols     = Math.ceil(fW / tileSize);
    const rows     = Math.ceil(fH / tileSize);

    ctx.save();
    // Clip drawing to floor rectangle
    ctx.beginPath();
    ctx.rect(fL, fT, fW, fH);
    ctx.clip();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tx = fL + col * tileSize;
        const ty = fT + row * tileSize;
        this._drawTile(ctx, tx, ty, tileSize, (row + col) % 2 === 0);
      }
    }

    ctx.restore();
  }

  _drawTile(ctx, tx, ty, size, light) {
    // Alternating warm wood tones
    ctx.fillStyle = light ? '#F0C87A' : '#E8BC6A';
    ctx.fillRect(tx, ty, size, size);

    // Subtle grout lines
    ctx.strokeStyle = 'rgba(100,65,20,0.22)';
    ctx.lineWidth   = 1;
    ctx.strokeRect(tx, ty, size, size);

    // Faint wood-grain highlight on lighter tiles
    if (light) {
      ctx.strokeStyle = 'rgba(255,235,160,0.30)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(tx + size * 0.15, ty + size * 0.25);
      ctx.lineTo(tx + size * 0.55, ty + size * 0.25);
      ctx.stroke();
    }
  }

  // ─── D. Side walls ──────────────────────────────────────────────────────────

  _drawSideWalls(ctx, W, H, fL, fT, fR, fB, sideWallW) {
    ctx.save();

    // Left side wall
    ctx.fillStyle   = '#C8A870';
    ctx.strokeStyle = '#8B6020';
    ctx.lineWidth   = 1.5;
    ctx.fillRect(fL, fT, sideWallW, fB - fT);
    ctx.strokeRect(fL, fT, sideWallW, fB - fT);

    // Right side wall
    ctx.fillStyle   = '#BEA070';
    ctx.strokeStyle = '#7A5818';
    ctx.fillRect(fR - sideWallW, fT, sideWallW, fB - fT);
    ctx.strokeRect(fR - sideWallW, fT, sideWallW, fB - fT);

    ctx.restore();
  }

  // ─── E. Door (left wall entrance) ───────────────────────────────────────────

  _drawDoor(ctx, W, H, fL, fT, fB, sideWallW) {
    ctx.save();

    // Door centred vertically at H * 0.54 (matching customer spawn Y)
    const doorH  = Math.max(40, (fB - fT) * 0.22);
    const doorCY = fT + (fB - fT) * 0.42;
    const doorY  = doorCY - doorH / 2;

    // Clear gap in the left wall
    ctx.fillStyle = '#DEB887';
    ctx.fillRect(fL, doorY, sideWallW + 2, doorH);

    // Door frame
    ctx.strokeStyle = '#8B6914';
    ctx.lineWidth   = 2.5;
    ctx.strokeRect(fL, doorY, sideWallW + 2, doorH);

    // Gold door knob (positioned proportionally within door frame)
    ctx.fillStyle   = '#FFD700';
    ctx.strokeStyle = '#B8960C';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(fL + sideWallW * 0.7, doorCY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // "入口" label outside to the left
    const fontSize = Math.max(8, H * 0.016);
    ctx.font      = `bold ${fontSize}px 'Comic Sans MS', cursive`;
    ctx.fillStyle = '#5C3317';
    ctx.textAlign = 'center';
    ctx.fillText('入口', fL - fontSize * 0.5, doorCY + fontSize * 0.4);

    ctx.restore();
  }

  // ─── F. Counter (back wall, right portion) ──────────────────────────────────

  _drawCounter(ctx, W, H, fL, fT, fR, backWallH) {
    ctx.save();

    const wallMidX  = fL + (fR - fL) * 0.52;
    const counterW  = Math.max(50, (fR - wallMidX) * 0.62);
    const counterH  = Math.max(14, backWallH * 0.55);
    const counterX  = wallMidX + (fR - wallMidX) * 0.10;
    const counterY  = fT - counterH;

    // Counter surface (top-down: rectangle)
    ctx.fillStyle   = '#7B4F2E';
    ctx.strokeStyle = '#4A2E0E';
    ctx.lineWidth   = 2;
    ctx.fillRect(counterX, counterY, counterW, counterH);
    ctx.strokeRect(counterX, counterY, counterW, counterH);

    // Lighter top ledge strip
    ctx.fillStyle   = '#A07040';
    ctx.fillRect(counterX, counterY, counterW, counterH * 0.25);
    ctx.strokeStyle = '#4A2E0E';
    ctx.lineWidth   = 1;
    ctx.strokeRect(counterX, counterY, counterW, counterH * 0.25);

    // Label
    const fontSize = Math.max(9, H * 0.020);
    ctx.font      = `bold ${fontSize}px 'Comic Sans MS', cursive`;
    ctx.fillStyle = '#FFE0B2';
    ctx.textAlign = 'center';
    ctx.fillText('☕ 吧台', counterX + counterW / 2, counterY + counterH * 0.72);

    // Coffee machine (top-down circle representation)
    this._drawCoffeeMachine(ctx, counterX + counterW / 2, counterY + counterH * 0.30, H);

    ctx.restore();
  }

  _drawCoffeeMachine(ctx, cx, cy, H) {
    const s  = Math.max(0.55, H / 960);
    const mW = 30 * s;
    const mH = 14 * s;

    // Machine body (top-down rounded rect)
    ctx.fillStyle   = '#2C1A08';
    ctx.strokeStyle = '#1A0900';
    ctx.lineWidth   = 1.5;
    _roundRect(ctx, cx - mW / 2, cy - mH / 2, mW, mH, 3 * s);
    ctx.fill();
    ctx.stroke();

    // Red panel
    ctx.fillStyle   = '#C0392B';
    ctx.strokeStyle = '#922B21';
    ctx.lineWidth   = 1;
    _roundRect(ctx, cx - mW * 0.40, cy - mH * 0.30, mW * 0.80, mH * 0.60, 2 * s);
    ctx.fill();
    ctx.stroke();

    // Buttons (top-down)
    ctx.fillStyle   = '#2C3E50';
    ctx.strokeStyle = '#1A252F';
    ctx.lineWidth   = 0.8;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(cx + i * 7 * s, cy, 2 * s, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  // ─── F. Windows (back wall) ─────────────────────────────────────────────────

  _drawWindows(ctx, W, H, fL, fT, fR, backWallH) {
    ctx.save();

    const winW  = Math.max(30, W * 0.075);
    const winH  = Math.max(12, backWallH * 0.55);
    const winY  = fT - backWallH * 0.85;

    // Two windows in the left half of the back wall
    const positions = [
      fL + (fR - fL) * 0.12,
      fL + (fR - fL) * 0.30,
    ];

    for (const wx of positions) {
      // Sky pane
      ctx.fillStyle   = '#87CEEB';
      ctx.strokeStyle = '#8B6914';
      ctx.lineWidth   = 2;
      _roundRect(ctx, wx, winY, winW, winH, 3);
      ctx.fill();
      ctx.stroke();

      // Cross divider
      ctx.strokeStyle = '#8B6914';
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(wx + winW / 2, winY);
      ctx.lineTo(wx + winW / 2, winY + winH);
      ctx.moveTo(wx,            winY + winH / 2);
      ctx.lineTo(wx + winW,     winY + winH / 2);
      ctx.stroke();

      // Curtain strips (simplified for top-down scale)
      ctx.fillStyle = '#FF8FAB';
      ctx.fillRect(wx - 3,         winY, 8, winH);
      ctx.fillRect(wx + winW - 5,  winY, 8, winH);
    }

    ctx.restore();
  }

  // ─── G. Corner plants ───────────────────────────────────────────────────────

  _drawPlants(ctx, H, fL, fR, fT, fB) {
    const s = Math.max(0.6, H / 700);
    const margin = Math.max(18, H * 0.03);

    // Top-left and top-right corners of the floor
    this._drawTopDownPot(ctx, fL + margin, fT + margin, s);
    this._drawTopDownPot(ctx, fR - margin, fT + margin, s);
  }

  _drawTopDownPot(ctx, cx, cy, scale = 1) {
    const s = scale;

    // Pot body (top-down circle)
    ctx.fillStyle   = '#8B5E3C';
    ctx.strokeStyle = '#4A2E0E';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 8 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Rim highlight
    ctx.strokeStyle = '#A07040';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 6 * s, 0, Math.PI * 2);
    ctx.stroke();

    // Leaves (seen from above — small circles radiating out)
    const leafData = [
      [cx,         cy - 11 * s, 6 * s],
      [cx - 9 * s, cy - 6 * s,  5 * s],
      [cx + 9 * s, cy - 6 * s,  5 * s],
      [cx - 7 * s, cy + 7 * s,  5 * s],
      [cx + 7 * s, cy + 7 * s,  5 * s],
    ];
    ctx.fillStyle   = '#5DB85D';
    ctx.strokeStyle = '#3A7A3A';
    ctx.lineWidth   = 1.5;
    for (const [leafX, leafY, r] of leafData) {
      ctx.beginPath();
      ctx.arc(leafX, leafY, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
}
