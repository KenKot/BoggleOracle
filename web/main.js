import createModule from "./boggle.js";

const $id = (id) => document.getElementById(id);
// const $class = (class) => document.getElementsByclass(class);

createModule().then((Module) => {
  // const $ = (id) => document.getElementById(id);

  const SIZE = 4;
  const boardEl = document.querySelector("#board");

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
  };

  $id("toggle").onclick = () => {
    console.log("toggle fired!");
    const p1 = $id("page1");
    const p2 = $id("page2");
    p1.classList.toggle("hidden");
    p2.classList.toggle("hidden");
  };

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

  // set
  // cells[0][0].value = "Qu";
  // get
  // console.log(cells[2][3].value);
});
