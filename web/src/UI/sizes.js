import { size4Btn, size5Btn, size6Btn } from "./DOM.js";

export function setSizeButtons(n) {
  size4Btn.disabled = n === 4;
  size5Btn.disabled = n === 5;
  size6Btn.disabled = n === 6;
}

export function initSizeButtons(onSizeChange) {
  size4Btn.addEventListener("click", () => onSizeChange(4));
  size5Btn.addEventListener("click", () => onSizeChange(5));
  size6Btn.addEventListener("click", () => onSizeChange(6));
}
