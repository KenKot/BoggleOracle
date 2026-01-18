import createModule from "../../boggle.js";

let modulePromise = null;

function ensureModule() {
  if (!modulePromise) modulePromise = createModule();
  return modulePromise;
}

export async function solveBoard(words, rows, cols) {
  const Module = await ensureModule();

  const strPtrs = words.map((s) => {
    const nBytes = Module.lengthBytesUTF8(s) + 1;
    const pStr = Module._malloc(nBytes);
    Module.stringToUTF8(s, pStr, nBytes);
    return pStr;
  });

  const pArray = Module._malloc(strPtrs.length * 4);
  Module.HEAPU32.set(new Uint32Array(strPtrs), pArray >>> 2);

  const ptr = Module._solveBoard(pArray, rows, cols);
  const jsonStr = Module.UTF8ToString(ptr);

  Module._free(ptr);
  Module._free(pArray);
  for (const p of strPtrs) Module._free(p);

  return JSON.parse(jsonStr);
}

