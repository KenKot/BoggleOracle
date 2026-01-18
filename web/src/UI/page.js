import { p1, p2 } from "./DOM.js";

export function showBoardPage() {
  p1.classList.remove("hidden");
  p2.classList.add("hidden");
}

export function showResultsPage() {
  p1.classList.add("hidden");
  p2.classList.remove("hidden");
}
