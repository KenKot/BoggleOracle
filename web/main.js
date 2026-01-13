import createModule from "./boggle.js";

const $id = (id) => document.getElementById(id);
// const $class = (class) => document.getElementsByclassName(class);

createModule().then((Module) => {
  const boardEl = document.querySelector("#board");
  const wordCountEl = document.querySelector("#word-count");
  const scoreCountEl = document.querySelector("#score-count");
  const wordFoundOlEl = document.querySelector("#words-found-ol");

  const SIZE = 4;
  let wordPaths = []; // use index that's stored on html element

  $id("run").onclick = () => {
    const words = cells.flat().map((inp) => inp.value.trim().toLowerCase());
    const rows = SIZE;
    const cols = SIZE;

    const strPtrs = words.map((s) => {
      const nBytes = Module.lengthBytesUTF8(s) + 1;
      const pStr = Module._malloc(nBytes);
      Module.stringToUTF8(s, pStr, nBytes);
      return pStr;
    });

    const n = strPtrs.length;
    const pArray = Module._malloc(n * 4); // 4 bytes per pointer in wasm32
    Module.HEAPU32.set(new Uint32Array(strPtrs), pArray >>> 2);

    const ptr = Module._solveBoard(pArray, rows, cols);
    const jsonStr = Module.UTF8ToString(ptr);
    Module._free(ptr);

    Module._free(pArray);
    for (const p of strPtrs) Module._free(p);

    console.log("The strings sent:", words);
    console.log("JSON result from C++:", jsonStr);

    // convert string to js
    const result = JSON.parse(jsonStr);
    console.log("result is", result);
    // console.log("word count", result["wordCount"]);
    // console.log("ma")
    handleJsonRes(result);
  };

  // populate UI w/ JSON reponse
  const handleJsonRes = (res) => {
    let { maxScore, wordCount, words } = res;
    scoreCountEl.textContent = maxScore;
    wordCountEl.textContent = wordCount;

    for (let i = 0; i < words.length; i++) {
      const { word, definition, points, path } = words[i];
      const olListItem = document.createElement("li");
      // olListItem.textContent = `${word} (${points}pts) : ${definition}`;

      // store each words path data in JS,
      // then use array index to store on html and to later use to access
      olListItem.dataset.arrayIndex = i;

      // by references should be ok
      // let pathCopy = path.map((row) => row.slice()); // need to copy 2d array
      // wordPaths.push(pathCopy); // 'wordsPath' is a parent scope

      wordPaths.push(path); // 'wordsPath' is a parent scope

      olListItem.textContent = `${word} (${points}pts) : ${definition} - ${path}`;

      wordFoundOlEl.appendChild(olListItem);
    }
    console.log(wordPaths[0]);
  };

  // /populate UI w/ JSON reponse

  // prefill board for testing
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
  $id("prefill").onclick = prefillBoard;
  // /prefill board for testing

  // /populate UI w/ JSON reponse

  // toggle page
  $id("toggle").onclick = () => {
    console.log("toggle fired!");
    const p1 = $id("page1");
    const p2 = $id("page2");
    p1.classList.toggle("hidden");
    p2.classList.toggle("hidden");
  };
  // /toggle page

  // create grid
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
      // set
      // cells[0][0].value = "Qu";
      // get
      // console.log(cells[2][3].value);
    }
  }
  // /create grid
});
