"use client";
export async function generateComposite(modelURL: string, outfitURL: string | null, poseLabel: string, style: string): Promise<string> {
  // Simple client-side canvas compositing to simulate generation
  const canvas = document.createElement('canvas');
  const W = 800, H = 1000;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Fill background
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, W, H);

  const loadImg = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  try {
    if (modelURL) {
      const m = await loadImg(modelURL);
      // fit image to width
      const scale = Math.min(W / m.width, H / m.height);
      const mw = m.width * scale;
      const mh = m.height * scale;
      ctx.drawImage(m, (W - mw) / 2, (H - mh) / 2, mw, mh);
    }
    if (outfitURL) {
      const o = await loadImg(outfitURL);
      const scale = Math.min(W / o.width, H / o.height) * 0.9;
      const ow = o.width * scale;
      const oh = o.height * scale;
      ctx.globalAlpha = 0.85;
      ctx.drawImage(o, (W - ow) / 2, (H - oh) / 2, ow, oh);
      ctx.globalAlpha = 1.0;
    }
    // Pose label and style tint
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Pose: ${poseLabel} | Style: ${style}`, 20, H - 26);
  } catch (e) {
    // ignore image loading errors; return blank canvas data
  }

  return canvas.toDataURL('image/png');
}
