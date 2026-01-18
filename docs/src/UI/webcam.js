// src/UI/webcam.js
import { createWebcam } from "../services/webcam.js";
import { initClassifier, classifyBoard } from "../services/tileClassifier.js";
import { camCanvas, startCamBtn, takePictureBtn } from "./DOM.js";
import { state } from "../state.js";

export function initWebcamUI() {
  const cam = createWebcam({
    canvasEl: camCanvas,
    viewSize: 640,
    getGridN: () => state.size,
    drawOverlay: true,
  });

  let classifierReady = false;

  startCamBtn.addEventListener("click", async () => {
    startCamBtn.disabled = true;
    try {
      await cam.start({ facingMode: "environment" });
      takePictureBtn.disabled = false;
    } catch (e) {
      console.error(e);
      startCamBtn.disabled = false;
      takePictureBtn.disabled = true;
    }
  });

  takePictureBtn.addEventListener("click", async () => {
    if (!cam.isRunning()) return;

    takePictureBtn.disabled = true;

    try {
      const snap = cam.snapshotCanvas();

      if (!classifierReady) {
        await initClassifier();
        classifierReady = true;
      }

      const grid = await classifyBoard(snap, state.size);
      for (let r = 0; r < state.size; r++) {
        for (let c = 0; c < state.size; c++) {
          state.cells[r][c].value = grid[r][c];
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      takePictureBtn.disabled = !cam.isRunning();
    }
  });

  return cam;
}
