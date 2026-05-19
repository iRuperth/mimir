/* Apple Liquid Glass — SDF refraction with circular bead falloff.
   Ported from the AGSL/SkSL shader at github.com/Kashif-E/KMPLiquidGlass
   (Apache 2.0, originally by Kyant). The key difference vs naive gradient
   displacement: the bead uses circleMap(t) = 1 - sqrt(1 - t^2), giving
   the curved "water-drop" lensing instead of a linear ramp. The gradient
   direction is the normal of a rounded-rect SDF, so refraction always
   bends perpendicular to the nearest edge. */

interface FilterOptions {
  width: number;
  height: number;
  radius: number;
  refractionHeight: number;
  refractionAmount: number;
  chromaticAberration?: number;
  depthEffect?: number;
}

const MAX_MAP_DIM = 1024;
const mapCache = new Map<string, string>();
const filterCache = new Map<string, string>();

const generateDisplacementPng = (
  width: number,
  height: number,
  radius: number,
  refractionHeight: number,
  depthEffect: number,
): string => {
  const downscale = Math.min(MAX_MAP_DIM / Math.max(width, height, 1), 1);
  const mw = Math.max(16, Math.round(width * downscale));
  const mh = Math.max(16, Math.round(height * downscale));
  const mr = Math.min(radius * downscale, Math.min(mw, mh) / 2);
  const rh = refractionHeight * downscale;

  const key = `${mw}_${mh}_${mr.toFixed(2)}_${rh.toFixed(2)}_${depthEffect.toFixed(2)}`;
  const cached = mapCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = mw;
  canvas.height = mh;
  const ctx = canvas.getContext('2d', { willReadFrequently: false });
  if (!ctx) return '';
  const img = ctx.createImageData(mw, mh);
  const data = img.data;

  const hx = mw / 2;
  const hy = mh / 2;

  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const cx = x - hx;
      const cy = y - hy;

      const dxC = Math.abs(cx) - (hx - mr);
      const dyC = Math.abs(cy) - (hy - mr);
      const outside = Math.hypot(Math.max(dxC, 0), Math.max(dyC, 0)) - mr;
      const inside = Math.min(Math.max(dxC, dyC), 0);
      const sd = outside + inside;

      const idx = (y * mw + x) * 4;

      if (sd > 0 || -sd >= rh) {
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      const t = 1 - -sd / rh;
      const curve = 1 - Math.sqrt(1 - t * t);

      let gx: number;
      let gy: number;
      if (dxC >= 0 || dyC >= 0) {
        const ox = Math.max(dxC, 0);
        const oy = Math.max(dyC, 0);
        const len = Math.hypot(ox, oy) || 1;
        gx = Math.sign(cx) * (ox / len);
        gy = Math.sign(cy) * (oy / len);
      } else if (dxC > dyC) {
        gx = Math.sign(cx);
        gy = 0;
      } else {
        gx = 0;
        gy = Math.sign(cy);
      }

      if (depthEffect > 0) {
        const radLen = Math.hypot(cx, cy) || 1;
        gx += depthEffect * (cx / radLen);
        gy += depthEffect * (cy / radLen);
        const gLen = Math.hypot(gx, gy) || 1;
        gx /= gLen;
        gy /= gLen;
      }

      data[idx] = Math.max(0, Math.min(255, Math.round(128 + curve * gx * 127)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + curve * gy * 127)));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const uri = canvas.toDataURL('image/png');
  mapCache.set(key, uri);
  return uri;
};

export const getDisplacementFilter = ({
  width,
  height,
  radius,
  refractionHeight,
  refractionAmount,
  chromaticAberration = 0,
  depthEffect = 0,
}: FilterOptions): string => {
  const key = `${width}_${height}_${radius}_${refractionHeight}_${refractionAmount}_${chromaticAberration}_${depthEffect}`;
  const cached = filterCache.get(key);
  if (cached) return cached;

  const png = generateDisplacementPng(width, height, radius, refractionHeight, depthEffect);
  if (!png) return '';

  const scale = 2 * refractionAmount;
  const svg = `<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="lg" color-interpolation-filters="sRGB"><feImage x="0" y="0" width="${width}" height="${height}" href="${png}" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="${scale + chromaticAberration * 2}" xChannelSelector="R" yChannelSelector="G"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="R"/><feDisplacementMap in="SourceGraphic" in2="map" scale="${scale + chromaticAberration}" xChannelSelector="R" yChannelSelector="G"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="G"/><feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="B"/><feBlend in="R" in2="G" mode="screen"/><feBlend in2="B" mode="screen"/></filter></defs></svg>#lg`;

  const uri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  filterCache.set(key, uri);
  return uri;
};

let supportsBackdropFilterUrlCache: boolean | null = null;
export const supportsBackdropFilterUrl = (): boolean => {
  if (supportsBackdropFilterUrlCache !== null) return supportsBackdropFilterUrlCache;
  if (typeof document === 'undefined') return false;
  const el = document.createElement('div');
  el.style.cssText = 'backdrop-filter: url(#test)';
  supportsBackdropFilterUrlCache =
    el.style.backdropFilter === 'url(#test)' ||
    el.style.backdropFilter === 'url("#test")';
  return supportsBackdropFilterUrlCache;
};
