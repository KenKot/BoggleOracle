import createModule from "./boggle.js";

// page 1 elements:
const p1 = document.querySelector("#page1");
const boardEl = document.querySelector("#board");
const runBtnEl = document.querySelector("#run");
const prefillBtnEl = document.querySelector("#prefill");

// page 2 elements:
const p2 = document.querySelector("#page2");
const wordCountEl = document.querySelector("#word-count");
const scoreCountEl = document.querySelector("#score-count");
const wordFoundOlEl = document.querySelector("#words-found-ol");
const newGameBtnEl = document.querySelector("#new-game");

const SIZE = 4;
let wordPaths = [];

// new game:
newGameBtnEl.onclick = () => {
  wordPaths = [];
  togglePages();
};

// create grid:
const cells = Array.from({ length: SIZE }, () => Array(SIZE));
for (let r = 0; r < SIZE; r++) {
  for (let c = 0; c < SIZE; c++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 2;
    input.className =
      "input input-bordered input-sm " +
      "!w-10 !h-10 !min-w-0 !px-0 !py-0 text-center leading-none";
    input.dataset.row = r;
    input.dataset.col = c;
    boardEl.appendChild(input);
    cells[r][c] = input;
  }
}

const togglePages = () => {
  p1.classList.toggle("hidden");
  p2.classList.toggle("hidden");
};

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

// prefill for testing
const prefillBoard = () => {
  const preset = [
    ["e", "i", "l", "a"],
    ["t", "p", "a", "g"],
    ["r", "e", "t", "o"],
    ["h", "t", "a", "y"],
  ];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      cells[r][c].value = preset[r][c];
    }
  }
};

prefillBtnEl.onclick = prefillBoard;

createModule().then((Module) => {
  runBtnEl.onclick = () => {
    const words = cells.flat().map((inp) => inp.value.trim().toLowerCase());

    const strPtrs = words.map((s) => {
      const nBytes = Module.lengthBytesUTF8(s) + 1;
      const pStr = Module._malloc(nBytes);
      Module.stringToUTF8(s, pStr, nBytes);
      return pStr;
    });

    const pArray = Module._malloc(strPtrs.length * 4);
    Module.HEAPU32.set(new Uint32Array(strPtrs), pArray >>> 2);

    const ptr = Module._solveBoard(pArray, SIZE, SIZE);
    const jsonStr = Module.UTF8ToString(ptr);

    Module._free(ptr);
    Module._free(pArray);
    for (const p of strPtrs) Module._free(p);

    const result = JSON.parse(jsonStr);
    handleJsonRes(result);

    togglePages();
  };
});
