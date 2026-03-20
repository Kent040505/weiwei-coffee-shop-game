/**
 * topdown.js
 * Top-down orthographic grid utilities for the tile-based cafe view.
 *
 * TILE_SIZE defines the square tile size.
 * World coordinates (wx, wy) map 1:1 to screen pixels.
 *
 * Axes (standard 2D screen space):
 *   +x → right
 *   +y → down
 */

export const TILE_SIZE = 48; // default square tile size in pixels

/**
 * Snap a world coordinate to the nearest tile grid position.
 * @param {number} wx - World X (screen pixel)
 * @param {number} tileSize - Tile size in pixels (default TILE_SIZE)
 * @returns {number} Snapped X aligned to tile grid
 */
export function snapX(wx, tileSize = TILE_SIZE) {
  return Math.round(wx / tileSize) * tileSize;
}

/**
 * Snap a world coordinate to the nearest tile grid position.
 * @param {number} wy - World Y (screen pixel)
 * @param {number} tileSize - Tile size in pixels (default TILE_SIZE)
 * @returns {number} Snapped Y aligned to tile grid
 */
export function snapY(wy, tileSize = TILE_SIZE) {
  return Math.round(wy / tileSize) * tileSize;
}

/**
 * Convert tile grid column/row → world (screen pixel) centre.
 * @param {number} col - Tile column index (0 = leftmost)
 * @param {number} row - Tile row index (0 = topmost)
 * @param {number} originX - Screen X of the tile grid origin (column 0)
 * @param {number} originY - Screen Y of the tile grid origin (row 0)
 * @param {number} tileSize - Tile size in pixels (default TILE_SIZE)
 * @returns {{ wx: number, wy: number }}
 */
export function tileToWorld(col, row, originX, originY, tileSize = TILE_SIZE) {
  return {
    wx: originX + col * tileSize + tileSize / 2,
    wy: originY + row * tileSize + tileSize / 2,
  };
}

/**
 * Convert world (screen pixel) position → tile grid column/row.
 * @param {number} wx - World X (screen pixel)
 * @param {number} wy - World Y (screen pixel)
 * @param {number} originX - Screen X of the tile grid origin (column 0)
 * @param {number} originY - Screen Y of the tile grid origin (row 0)
 * @param {number} tileSize - Tile size in pixels (default TILE_SIZE)
 * @returns {{ col: number, row: number }}
 */
export function worldToTile(wx, wy, originX, originY, tileSize = TILE_SIZE) {
  return {
    col: Math.floor((wx - originX) / tileSize),
    row: Math.floor((wy - originY) / tileSize),
  };
}
