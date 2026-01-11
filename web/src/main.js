import createModule from "./boggle.js";
const Module = await createModule();
const $ = (id) => document.getElementById(id);

$("run").onclick = () => {
  console.log(new Date().toString());
  let words = ["qu", "a", "t", "x", "c", "k"];
  let cols = 3;
  let rows = 2;

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
};
