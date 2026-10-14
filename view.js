// Guías de dimensiones y encuadre de la cuadrícula.
const quoteWithSelection = quote;
function designDimensions() {
  const m = model(), ids = Object.keys(state.cells).map(Number);
  if (!ids.length) return { width: 0, length: 0 };
  const cols = Math.floor(3000 / m.width);
  const columns = ids.map(n => n % cols), rows = ids.map(n => Math.floor(n / cols));
  return {
    width: (Math.max(...columns) - Math.min(...columns) + 1) * m.width / 100,
    length: (Math.max(...rows) - Math.min(...rows) + 1) * m.length / 100
  };
}
function setGridZoom(amount) { state.fullView = false; state.gridZoom = Math.max(.08, Math.min(1.5, amount)); render(); }
function zoomGrid(delta) { setGridZoom((state.gridZoom ?? 1) + delta); }
function fullGridView() {
  const m = model(), cols = Math.floor(3000 / m.width), rows = Math.floor(3000 / m.length);
  const wrap = document.querySelector('.grid-wrap');
  const scale = Math.min(1, (wrap.clientWidth - 28) / (cols * 22), (wrap.clientHeight - 28) / (rows * 22));
  state.fullView = true;
  state.gridZoom = Math.max(.08, Math.min(1, scale));
  render();
}
quote = function () {
  const m = model(), dims = designDimensions();
  let html = quoteWithSelection();
  const dimensions = `<div class="notice" style="margin:10px 0 0;padding:9px;background:#f0f3ec;border-radius:4px"><b>Medidas del diseño:</b> ${dims.width.toFixed(2)} m de ancho × ${dims.length.toFixed(2)} m de largo</div>`;
  const controls = `<div class="canvas-tools" style="margin:8px 0"><span class="notice">Vista: ${Math.round((state.gridZoom??1)*100)}%</span><div><button class="tool" onclick="zoomGrid(-.1)">−</button><button class="tool" onclick="zoomGrid(.1)">+</button><button class="tool" onclick="fullGridView()">Vista completa</button></div></div>`;
  const guides = `<div class="notice" style="text-align:center;margin:4px 0">↔ <b>Ancho máximo: 30,00 m</b></div><div style="display:flex;align-items:center;gap:7px"><div class="notice" style="writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap">↕ <b>Largo máximo: 30,00 m</b></div><div class="grid-wrap" style="flex:1">`;
  html = html.replace('<div class="grid-wrap">', dimensions + controls + guides).replace('</div></section><aside', '</div></div></section><aside');
  return html.replace('grid-template-rows:repeat(', `zoom:${state.gridZoom??1};grid-template-rows:repeat(`);
};
