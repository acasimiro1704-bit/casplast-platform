// Llenado inicial por medidas reales. El resultado sigue siendo editable celda por celda.
function fillFromMeters() {
  const widthMeters = Number($('#fillWidth').value), lengthMeters = Number($('#fillLength').value);
  if (!(widthMeters > 0) || !(lengthMeters > 0)) return alert('Ingresá ancho y largo en metros.');
  if (widthMeters > 30 || lengthMeters > 30) return alert('El área máxima es de 30 × 30 metros.');
  const m = model(), cols = Math.floor(3000 / m.width), rows = Math.floor(3000 / m.length);
  const tileCols = Math.min(cols, Math.ceil(widthMeters * 100 / m.width));
  const tileRows = Math.min(rows, Math.ceil(lengthMeters * 100 / m.length));
  capture();
  for (let row = 0; row < tileRows; row++) for (let column = 0; column < tileCols; column++) state.cells[row * cols + column] = state.color;
  state.fullView = false;
  render();
}
const quoteWithQuickFill = quote;
quote = function () {
  const html = quoteWithQuickFill();
  const form = `<div class="panel" style="margin:10px 0;padding:12px"><b style="font-size:14px">Llenado rápido por medidas</b><div class="toolbar" style="margin-top:8px"><label class="notice">Ancho (m)<input id="fillWidth" class="control" type="number" min="0.01" max="30" step=".01" style="width:88px;margin-left:5px"></label><label class="notice">Largo (m)<input id="fillLength" class="control" type="number" min="0.01" max="30" step=".01" style="width:88px;margin-left:5px"></label><button class="primary" onclick="fillFromMeters()">Llenar con color seleccionado</button></div><p class="notice" style="margin:7px 0 0">Luego podés editar, borrar o cambiar el color de cada baldosa manualmente.</p></div>`;
  return html.replace('<div class="grid-wrap" style="flex:1;display:flex', form + '<div class="grid-wrap" style="flex:1;display:flex');
};
