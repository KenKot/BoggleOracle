export function createWebcam(options) {
  options = options || {};

  const canvasEl = options.canvasEl;
  const viewSize = options.viewSize !== undefined ? options.viewSize : 640;
  const getGridN =
    options.getGridN ||
    function () {
      return 4;
    };
  const drawOverlay =
    options.drawOverlay !== undefined ? options.drawOverlay : true;

  if (!canvasEl) {
    throw new Error("createWebcam: canvasEl is required");
  }

  const ctx = canvasEl.getContext("2d", { willReadFrequently: true });
  canvasEl.width = viewSize;
  canvasEl.height = viewSize;

  let video = null;
  let stream = null;
  let running = false;
  let rafId = null;

  function ensureVideo() {
    if (video) return;
    video = document.createElement("video");
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
  }

  function drawVideoToSquare() {
    if (!video) return;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const side = Math.min(vw, vh);
    const sx = Math.floor((vw - side) / 2);
    const sy = Math.floor((vh - side) / 2);

    ctx.drawImage(video, sx, sy, side, side, 0, 0, viewSize, viewSize);
  }

  function drawGrid() {
    const N = Number(getGridN());
    if (!Number.isFinite(N) || N <= 0) return;

    const cell = viewSize / N;

    ctx.save();
    ctx.strokeStyle = "rgba(0,255,0,0.85)";
    ctx.lineWidth = 2;

    ctx.strokeRect(1, 1, viewSize - 2, viewSize - 2);

    for (let i = 1; i < N; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cell, 0);
      ctx.lineTo(i * cell, viewSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cell);
      ctx.lineTo(viewSize, i * cell);
      ctx.stroke();
    }

    ctx.restore();
  }

  function loop() {
    if (!running) return;
    drawVideoToSquare();
    if (drawOverlay) drawGrid();
    rafId = requestAnimationFrame(loop);
  }

  async function start(startOptions) {
    startOptions = startOptions || {};
    const facingMode = startOptions.facingMode || "environment";

    if (stream && video && !running) {
      running = true;
      rafId = requestAnimationFrame(loop);
      return;
    }

    if (running) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Camera API not available (use HTTPS or localhost).");
    }

    ensureVideo();

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facingMode } },
      audio: false,
    });

    video.srcObject = stream;

    await new Promise(function (resolve) {
      video.onloadedmetadata = resolve;
    });

    try {
      await video.play();
    } catch (err) {}

    running = true;
    rafId = requestAnimationFrame(loop);
  }

  function freeze() {
    if (!stream || !video) return;

    drawVideoToSquare();
    if (drawOverlay) drawGrid();

    running = false;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function stop() {
    running = false;

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    if (stream) {
      stream.getTracks().forEach(function (track) {
        track.stop();
      });
      stream = null;
    }

    if (video) {
      try {
        video.srcObject = null;
      } catch (err) {}
      video = null;
    }
  }

  function snapshotCanvas() {
    drawVideoToSquare();

    const c = document.createElement("canvas");
    c.width = viewSize;
    c.height = viewSize;
    const cctx = c.getContext("2d", { willReadFrequently: true });
    cctx.drawImage(canvasEl, 0, 0);
    return c;
  }

  function isRunning() {
    return running;
  }

  return {
    start,
    freeze,
    stop,
    snapshotCanvas,
    isRunning,
  };
}
