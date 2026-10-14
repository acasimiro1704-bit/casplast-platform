// Diseño rápido: pincel por arrastre y relleno de bloques rectangulares.
const quoteWithLargeGrid = quote;
quote = function () {
  const html = quoteWithLargeGrid();
  return addBlockControls(html);
};
function addBlockControls(html) {
  const button = `<button class="tool ${state.tool==='rectangle'?'selected':''}" onclick="state.tool='rectangle';state.rectangleAnchor=null;render()">Bloque</button>`;
  const colors = model()?.colors || [];
  if (!colors.includes(state.blockSecondColor)) state.blockSecondColor = colors.find(id => id !== state.color) || colors[0];
  const alternating = `<button class="tool ${state.tool==='alternating'?'selected':''}" onclick="state.tool='alternating';state.rectangleAnchor=null;render()">Bloque intermitente</button>`;
  const settings = state.tool==='alternating' ? `<div class="panel" style="margin:10px 0;padding:12px"><b>Bloque intermitente de dos colores</b><div class="toolbar" style="margin-top:8px"><label>Color 1 <select class="control" onchange="state.color=this.value;state.rectangleAnchor=null;render()">${colors.map(id=>`<option value="${id}" ${state.color===id?'selected':''}>${escapeHtml(col(id).name)}</option>`).join('')}</select></label><label>Color 2 <select class="control" onchange="state.blockSecondColor=this.value;state.rectangleAnchor=null;render()">${colors.map(id=>`<option value="${id}" ${state.blockSecondColor===id?'selected':''}>${escapeHtml(col(id).name)}</option>`).join('')}</select></label></div><p class="notice">Marcá una esquina y luego la esquina opuesta del bloque. Los colores alternan baldosa por baldosa, como un tablero. Después podés editar cada baldosa.</p></div>` : '';
  const controls = html.includes('>Bloque</button>') ? alternating : button + alternating;
  return html.replace('>Borrar</button>', '>Borrar</button>' + controls).replace('<div class="color-palette">', settings + '<div class="color-palette">');
}

function applyCell(cell) {
  const n = Number(cell.dataset.cell);
  if (Number.isNaN(n)) return;
  if (state.tool === 'erase') delete state.cells[n];
  else state.cells[n] = state.color;
  cell.classList.toggle('filled', state.tool !== 'erase');
  cell.style.background = state.tool === 'erase' ? '' : col(state.color).hex;
}

function finishRectangle(end) {
  const m = model();
  const cols = Math.floor(3000 / m.width);
  const maxTiles = cols * Math.floor(3000 / m.length);
  const start = state.rectangleAnchor;
  const r1 = Math.floor(start / cols), c1 = start % cols;
  const r2 = Math.floor(end / cols), c2 = end % cols;
  const minR = Math.min(r1, r2), maxR = Math.max(r1, r2);
  const minC = Math.min(c1, c2), maxC = Math.max(c1, c2);
  if (state.tool === 'alternating' && (!m.colors.includes(state.blockSecondColor) || state.color === state.blockSecondColor)) {
    state.rectangleAnchor = null;
    alert('Elegí dos colores diferentes para el bloque intermitente.');
    render();
    return;
  }
  capture();
  for (let row = minR; row <= maxR; row++) for (let column = minC; column <= maxC; column++) {
    const n = row * cols + column;
    if (n >= maxTiles) continue;
    if (state.tool === 'erase') delete state.cells[n];
    else state.cells[n] = state.tool === 'alternating' && (row-minR+column-minC)%2 ? state.blockSecondColor : state.color;
  }
  state.rectangleAnchor = null;
  render();
}

bindGrid = function () {
  const floor = $('#floor');
  let dragging = false, changed = false;
  floor.onpointerdown = e => {
    const cell = e.target.closest('[data-cell]'); if (!cell) return;
    if (state.tool === 'rectangle' || state.tool === 'alternating') {
      const n = Number(cell.dataset.cell);
      if (state.rectangleAnchor === null || state.rectangleAnchor === undefined) {
        state.rectangleAnchor = n;
        cell.style.outline = '3px solid #d7f045';
      } else finishRectangle(n);
      return;
    }
    capture(); changed = true; dragging = true; applyCell(cell); e.preventDefault();
  };
  floor.onpointerover = e => { if (dragging) { const cell = e.target.closest('[data-cell]'); if (cell) applyCell(cell); } };
  window.onpointerup = () => { if (dragging && changed) { dragging = false; changed = false; render(); } };
};
