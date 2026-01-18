import * as ort from "../vendor/onnxruntime-web/ort.min.mjs";

const INSET_PCT = 0.15;
const CLS_SIZE = 224;
const MODEL_URL = new URL("../model/best.onnx", import.meta.url).toString();

const CLASS_NAMES = [
  "a",
  "an",
  "b",
  "c",
  "d",
  "e",
  "er",
  "f",
  "g",
  "h",
  "he",
  "i",
  "in",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "qu",
  "r",
  "s",
  "t",
  "t-",
  "th",
  "u",
  "v",
  "w",
  "wild",
  "x",
  "y",
  "z",
];

ort.env.wasm.wasmPaths = new URL(
  "../vendor/onnxruntime-web/",
  import.meta.url
).toString();
ort.env.wasm.simd = true;
ort.env.wasm.numThreads = crossOriginIsolated
  ? Math.min(4, navigator.hardwareConcurrency || 4)
  : 1;

let sessionPromise = null;

async function ensureSession() {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(MODEL_URL, {
      executionProviders: ["wasm"],
    });
  }
  return sessionPromise;
}

export async function initClassifier() {
  await ensureSession();
}

export async function classifyBoard(boardCanvas, N) {
  const session = await ensureSession();

  const viewSize = boardCanvas.width;
  const cell = viewSize / N;

  const grid = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => "?")
  );

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const x = c * cell;
      const y = r * cell;

      const inset = cell * INSET_PCT;
      const rx = x + inset;
      const ry = y + inset;
      const rw = cell - 2 * inset;
      const rh = cell - 2 * inset;

      const tileCanvas = cropToCanvas(
        boardCanvas,
        rx,
        ry,
        rw,
        rh,
        CLS_SIZE,
        CLS_SIZE
      );

      const label = await classifyTile(session, tileCanvas);
      grid[r][c] = normalizeTile(label);
    }
  }

  return grid;
}

async function classifyTile(session, tileCanvas) {
  const tensor = canvasToTensorRGB(tileCanvas);
  const feeds = { [session.inputNames[0]]: tensor };

  const outMap = await session.run(feeds);
  const outTensor = outMap[session.outputNames[0]];
  const logits = outTensor.data;

  const probs = softmax(logits);
  const bestIdx = argmax(probs);

  return CLASS_NAMES[bestIdx] ?? String(bestIdx);
}

function canvasToTensorRGB(tileCanvas) {
  const w = tileCanvas.width;
  const h = tileCanvas.height;
  const tctx = tileCanvas.getContext("2d", { willReadFrequently: true });
  const img = tctx.getImageData(0, 0, w, h);
  const d = img.data;

  const area = w * h;
  const float = new Float32Array(3 * area);

  for (let i = 0; i < area; i++) {
    const r = d[i * 4 + 0] / 255;
    const g = d[i * 4 + 1] / 255;
    const b = d[i * 4 + 2] / 255;

    float[i] = r;
    float[area + i] = g;
    float[2 * area + i] = b;
  }

  return new ort.Tensor("float32", float, [1, 3, h, w]);
}

function cropToCanvas(srcCanvas, x, y, w, h, outW, outH) {
  const c = document.createElement("canvas");
  c.width = outW;
  c.height = outH;
  const cctx = c.getContext("2d", { willReadFrequently: true });
  cctx.drawImage(srcCanvas, x, y, w, h, 0, 0, outW, outH);
  return c;
}

function softmax(arr) {
  let max = -Infinity;
  for (let i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];

  const exps = new Float32Array(arr.length);
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    const e = Math.exp(arr[i] - max);
    exps[i] = e;
    sum += e;
  }

  for (let i = 0; i < exps.length; i++) exps[i] /= sum;

  return exps;
}

function argmax(arr) {
  let best = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > arr[best]) best = i;
  }
  return best;
}

function normalizeTile(label) {
  if (!label) return "?";
  if (label === "qu") return "qu";
  if (label === "t-") return "t";
  if (label === "wild") return "*";
  return label.toLowerCase();
}
