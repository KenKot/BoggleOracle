import { runBtnEl, prefillBtnEl, newGameBtnEl } from "./UI/DOM.js";
import { prefillBoard } from "./testing/utils.js";
import { state, setSize, setCells } from "./state.js";
import { initWebcamUI } from "./UI/webcam.js";

import { buildGrid, clearGrid, readBoardWords } from "./UI/board.js";
import { showBoardPage, showResultsPage } from "./UI/page.js";
import { clearResults, renderResults } from "./UI/results.js";
import { initSizeButtons, setSizeButtons } from "./UI/sizes.js";
import { solveBoard } from "./services/WASMSolver.js";

const cam = initWebcamUI();

setSize(4);
setSizeButtons(4);
setCells(buildGrid(4));

initSizeButtons((n) => {
  setSize(n);
  setSizeButtons(n);
  setCells(buildGrid(n));
  clearGrid(state.cells);
  clearResults();
  showBoardPage();
});

newGameBtnEl.addEventListener("click", () => {
  clearResults();
  clearGrid(state.cells);
  showBoardPage();
});

prefillBtnEl.addEventListener("click", () => {
  prefillBoard(state.cells, state.size);
});

runBtnEl.addEventListener("click", async () => {
  cam?.stop?.();

  const words = readBoardWords(state.cells);
  const result = await solveBoard(words, state.size, state.size);
  renderResults(result);
  showResultsPage();
});
