/*for  <button id="prefill" class="btn btn-sm">Prefill</button> */
export function prefillBoard(cells, size) {
  const preset = [
    ["e", "i", "l", "a", "c", "e"],
    ["t", "p", "a", "g", "y", "g"],
    ["r", "e", "t", "o", "t", "a"],
    ["h", "t", "a", "y", "k", "l"],
    ["r", "t", "a", "y", "k", "l"],
    ["s", "a", "d", "e", "e", "l"],
  ];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cells[r][c].value = preset[r][c];
    }
  }
}
