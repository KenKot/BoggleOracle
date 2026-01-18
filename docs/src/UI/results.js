import { wordCountEl, scoreCountEl, wordFoundOlEl } from "./DOM.js";

export function clearResults() {
  wordFoundOlEl.textContent = "";
  wordCountEl.textContent = "";
  scoreCountEl.textContent = "";
}

export function renderResults(res) {
  wordFoundOlEl.textContent = "";

  const { maxScore, wordCount, words } = res;
  scoreCountEl.textContent = String(maxScore);
  wordCountEl.textContent = String(wordCount);

  for (let i = 0; i < words.length; i++) {
    const { word, definition, points, path } = words[i];
    const li = document.createElement("li");
    li.dataset.arrayIndex = String(i);
    // li.textContent = `${word} (${points}pts) : ${definition} - ${path}`;
    li.textContent = `${word} (${points}pts) : ${definition}`;
    wordFoundOlEl.appendChild(li);
  }
}
