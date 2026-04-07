export function generateAccentPalette(hex: string) {
  const num = parseInt(hex.slice(1), 16);

  const r = num >> 16;
  const g = (num >> 8) & 255;
  const b = num & 255;

  function mix(target: number, weight: number) {
    return Math.round(target * weight);
  }

  function blend(tr: number, tg: number, tb: number, w: number) {
    return `rgb(${mix(r, 1 - w) + mix(tr, w)}, ${mix(g, 1 - w) + mix(tg, w)}, ${
      mix(b, 1 - w) + mix(tb, w)
    })`;
  }

  return {
    "--accent-50": blend(255, 255, 255, 0.9),
    "--accent-100": blend(255, 255, 255, 0.75),
    "--accent-200": blend(255, 255, 255, 0.6),
    "--accent-300": blend(255, 255, 255, 0.4),
    "--accent-400": blend(255, 255, 255, 0.2),
    "--accent-500": `rgb(${r},${g},${b})`,
    "--accent-600": blend(0, 0, 0, 0.15),
    "--accent-700": blend(0, 0, 0, 0.3),
    "--accent-800": blend(0, 0, 0, 0.45),
    "--accent-900": blend(0, 0, 0, 0.6),
  };
}
