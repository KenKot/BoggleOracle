import createModule from "./boggle.js";

// -------------------------
// DOM ELEMENTS
// -------------------------
const p1 = document.querySelector("#page1");
const p2 = document.querySelector("#page2");

const boardEl = document.querySelector("#board");
const runBtnEl = document.querySelector("#run");
const prefillBtnEl = document.querySelector("#prefill");

const wordCountEl = document.querySelector("#word-count");
const scoreCountEl = document.querySelector("#score-count");
const wordFoundOlEl = document.querySelector("#words-found-ol");
const newGameBtnEl = document.querySelector("#new-game");

const size4Btn = document.querySelector("#size-4");
const size5Btn = document.querySelector("#size-5");
const size6Btn = document.querySelector("#size-6");

// -------------------------
// STATE
// -------------------------

let size = 4; // 4x4, 5x5, 6x6
let cells = []; // cell HTML elements
let wordPaths = []; // 2d array, index sored on cell html element

// -------------------------
// UI HELPERS
// -------------------------

const setBoardColsClass = (n) => {
  boardEl.classList.remove("grid-cols-4", "grid-cols-5", "grid-cols-6");
  boardEl.classList.add(`grid-cols-${n}`);
};

const setSizeButtons = (n) => {
  size4Btn.disabled = n === 4;
  size5Btn.disabled = n === 5;
  size6Btn.disabled = n === 6;
};

const buildGrid = (n) => {
  boardEl.textContent = "";
  setBoardColsClass(n);

  cells = Array.from({ length: n }, () => Array(n));

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
};

const clearGrid = () => {
  for (const row of cells) {
    for (const cell of row) {
      cell.value = "";
    }
  }
};

const togglePages = () => {
  p1.classList.toggle("hidden");
  p2.classList.toggle("hidden");
};

const clearResults = () => {
  wordPaths = [];
  wordFoundOlEl.textContent = "";
  wordCountEl.textContent = "";
  scoreCountEl.textContent = "";
};

// -------------------------
// SIZE BUTTONS
// -------------------------

// default state on load
setSizeButtons(4);
buildGrid(4);

size4Btn.addEventListener("click", () => {
  size = 4;
  setSizeButtons(4);
  buildGrid(4);
  clearGrid();
});

size5Btn.addEventListener("click", () => {
  size = 5;
  setSizeButtons(5);
  buildGrid(5);
  clearGrid();
});

size6Btn.addEventListener("click", () => {
  size = 6;
  setSizeButtons(6);
  buildGrid(6);
  clearGrid();
});

// -------------------------
// NEW GAME
// -------------------------

newGameBtnEl.addEventListener("click", () => {
  clearResults();
  clearGrid();
  togglePages();
});

// -------------------------
// PREFILL FOR TESTING
// -------------------------

const prefillBoard = () => {
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
};

prefillBtnEl.addEventListener("click", prefillBoard);

// -------------------------
// WASM
// -------------------------

createModule().then((Module) => {
  runBtnEl.addEventListener("click", () => {
    const words = cells.flat().map((inp) => inp.value.trim().toLowerCase());

    const strPtrs = words.map((s) => {
      const nBytes = Module.lengthBytesUTF8(s) + 1;
      const pStr = Module._malloc(nBytes);
      Module.stringToUTF8(s, pStr, nBytes);
      return pStr;
    });

    const pArray = Module._malloc(strPtrs.length * 4);
    Module.HEAPU32.set(new Uint32Array(strPtrs), pArray >>> 2);

    const ptr = Module._solveBoard(pArray, size, size);
    const jsonStr = Module.UTF8ToString(ptr);

    Module._free(ptr);
    Module._free(pArray);
    for (const p of strPtrs) Module._free(p);

    const result = JSON.parse(jsonStr);
    handleJsonRes(result);

    togglePages();
  });
});

// -------------------------
// RUN BUTTON HELPER - HANDLE JSON RESPONSE
// -------------------------

const handleJsonRes = (res) => {
  wordPaths = [];
  wordFoundOlEl.textContent = "";

  const { maxScore, wordCount, words } = res;
  scoreCountEl.textContent = maxScore;
  wordCountEl.textContent = wordCount;

  for (let i = 0; i < words.length; i++) {
    const { word, definition, points, path } = words[i];
    const li = document.createElement("li");
    li.dataset.arrayIndex = i;

    wordPaths.push(path);
    li.textContent = `${word} (${points}pts) : ${definition} - ${path}`;

    wordFoundOlEl.appendChild(li);
  }
};
