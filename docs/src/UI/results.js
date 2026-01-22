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
    li.className =
      "grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-1 items-start py-1";

    const wordEl = document.createElement("span");
    wordEl.className = "text-base font-semibold text-primary";
    wordEl.textContent = word;

    const pointsEl = document.createElement("span");
    pointsEl.className = "badge badge-outline badge-sm text-base";
    pointsEl.textContent = `${points} pts`;

    const sepEl = document.createElement("span");
    sepEl.className = "text-base-content/40";
    sepEl.textContent = ":";

    const defEl = document.createElement("span");
    defEl.className = "text-sm text-base-content/70 min-w-0";
    defEl.textContent = definition;

    li.appendChild(wordEl);
    li.appendChild(pointsEl);
    li.appendChild(sepEl);
    li.appendChild(defEl);
    wordFoundOlEl.appendChild(li);
  }
}
