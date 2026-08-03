export function loadWearImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function getWearDrawRect(
  img: HTMLImageElement,
  width: number,
  height: number,
  fit: number,
  mode: "cover" | "contain"
) {
  const ir = img.naturalWidth / img.naturalHeight;
  let dw = width;
  let dh = height;
  let dx = 0;
  let dy = 0;

  if (mode === "contain") {
    const padX = width * 0.04;
    const padY = height * 0.04;
    const boxW = width - padX * 2;
    const boxH = height - padY * 2;
    const cr = boxW / boxH;
    if (ir > cr) {
      dw = boxW * fit;
      dh = dw / ir;
    } else {
      dh = boxH * fit;
      dw = dh * ir;
    }
    dx = (width - dw) / 2;
    dy = (height - dh) / 2;
  } else {
    const cr = width / height;
    if (ir > cr) {
      dh = height * fit;
      dw = dh * ir;
    } else {
      dw = width * fit;
      dh = dw / ir;
    }
    dx = (width - dw) / 2;
    dy = (height - dh) / 2;
  }

  return { dx, dy, dw, dh };
}

export function drawWearPixelated(
  ctx: CanvasRenderingContext2D,
  framed: HTMLCanvasElement,
  width: number,
  height: number,
  block: number,
  tinyCanvas: HTMLCanvasElement
) {
  const size = Math.max(1, Math.round(block));
  ctx.clearRect(0, 0, width, height);

  if (size <= 1) {
    ctx.drawImage(framed, 0, 0);
    return;
  }

  const sw = Math.max(1, Math.ceil(width / size));
  const sh = Math.max(1, Math.ceil(height / size));
  if (tinyCanvas.width !== sw || tinyCanvas.height !== sh) {
    tinyCanvas.width = sw;
    tinyCanvas.height = sh;
  }
  const tctx = tinyCanvas.getContext("2d");
  if (!tctx) return;
  tctx.imageSmoothingEnabled = true;
  tctx.clearRect(0, 0, sw, sh);
  tctx.drawImage(framed, 0, 0, width, height, 0, 0, sw, sh);

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(tinyCanvas, 0, 0, sw, sh, 0, 0, width, height);
}

export function buildWearFramedBitmap(
  img: HTMLImageElement,
  width: number,
  height: number,
  fit: number,
  mode: "cover" | "contain",
  target: HTMLCanvasElement
) {
  if (target.width !== width || target.height !== height) {
    target.width = width;
    target.height = height;
  }
  const fctx = target.getContext("2d");
  if (!fctx) return target;
  const { dx, dy, dw, dh } = getWearDrawRect(img, width, height, fit, mode);
  fctx.clearRect(0, 0, width, height);
  fctx.imageSmoothingEnabled = true;
  fctx.drawImage(img, dx, dy, dw, dh);
  return target;
}
