// Reglas adaptativas: las etiquetas no cambian de tamaño al hacer zoom.
const quoteWithGuides = quote;
quote = function () {
  const m = model();
  const cols = Math.floor(3000 / m.width), rows = Math.floor(3000 / m.length);
  const zoom = state.gridZoom ?? 1;
  const gridWidth = cols * 22, gridHeight = rows * 22;
  const meterPixels = (gridWidth / 30) * zoom;
  const step = meterPixels < 18 ? 10 : meterPixels < 40 ? 5 : 1;
  const xMarks = Array.from({length:Math.floor(30 / step) + 1}, (_, i) => i * step).map(n => `<span style="position:absolute;left:${34 + n * gridWidth / 30 * zoom}px;top:1px;font-size:12px;line-height:16px;color:#3f4b42;white-space:nowrap">${n} m</span>`).join('');
  const yMarks = Array.from({length:Math.floor(30 / step) + 1}, (_, i) => i * step).map(n => `<span style="position:absolute;left:1px;top:${20 + n * gridHeight / 30 * zoom}px;font-size:12px;line-height:16px;color:#3f4b42;white-space:nowrap">${n} m</span>`).join('');
  let html = quoteWithGuides();
  const open = `<div class="grid-wrap" style="flex:1;display:flex;justify-content:${state.fullView?'center':'flex-start'};align-items:${state.fullView?'center':'flex-start'}"><div style="position:relative;width:${34 + gridWidth * zoom}px;height:${20 + gridHeight * zoom}px;min-width:${34 + gridWidth * zoom}px;min-height:${20 + gridHeight * zoom}px">${xMarks}${yMarks}<div style="margin-left:34px;margin-top:20px;width:max-content;zoom:${zoom}">`;
  html = html.replace('<div class="grid-wrap" style="flex:1">', open);
  html = html.replace(`zoom:${zoom};grid-template-rows:repeat(`, 'grid-template-rows:repeat(');
  return html.replace('</div></div></div></section><aside', '</div></div></div></div></div></section><aside');
};
