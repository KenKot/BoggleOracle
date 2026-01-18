import { boardEl } from "./DOM.js";

export function buildGrid(n) {
  boardEl.textContent = "";
  boardEl.classList.remove("grid-cols-4", "grid-cols-5", "grid-cols-6");
  boardEl.classList.add(`grid-cols-${n}`);

  const cells = Array.from({ length: n }, () => Array(n));
  const frag = document.createDocumentFragment();

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 2;

      input.className =
        "input input-bordered input-sm " +
        "!w-10 !h-10 !min-w-0 !px-0 !py-0 text-center leading-none";

      input.dataset.row = r;
      input.dataset.col = c;

      frag.appendChild(input);
      cells[r][c] = input;
    }
  }

  boardEl.appendChild(frag);
  return cells;
}

export function clearGrid(cells) {
  for (const row of cells) {
    for (const cell of row) cell.value = "";
  }
}

export function readBoardWords(cells) {
  return cells.flat().map((cell) => cell.value.trim().toLowerCase());
}
