export const state = {
  size: 4,
  cells: [], // 2D array of <input> elements
};

export function setSize(n) {
  state.size = n;
}

export function setCells(cells) {
  state.cells = cells;
}
