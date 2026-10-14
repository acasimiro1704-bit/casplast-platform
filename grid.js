// Cuadrícula adaptable: la capacidad se deriva de las medidas del modelo.
// El límite funcional es 300 m², independientemente del tamaño de baldosa.
quote = function () {
  const m = model();
  if (!m) return '<main class="shell section"><div class="empty">No hay modelos activos. Creá uno desde Administración.</div></main>';
  if (!m.colors.includes(state.color)) state.color = m.colors[0];
  const tileArea = m.width * m.length / 10000;
  const cols = Math.floor(3000 / m.width);
  const rows = Math.floor(3000 / m.length);
  const maxTiles = cols * rows;
  const used = cellCount();
  const area = used * tileArea;
  const extra = Math.ceil(used * db.waste / 100);
  const total = used + extra;
  const by = m.colors.map(id => [id, Object.values(state.cells).filter(x => x === id).length]).filter(x => x[1]);
  const cells = Array.from({length:maxTiles}, (_, i) => `<button class="cell ${state.cells[i]?'filled':''}" style="width:20px;height:20px;${state.cells[i]?`background:${col(state.cells[i]).hex}`:''}" data-cell="${i}"></button>`).join('');
  return `<main class="shell"><div class="page-head"><span class="kicker" style="color:#53634f">COTIZADOR VISUAL</span><h1>Dibujá tu proyecto.</h1></div><div class="quote-layout"><section class="panel"><div class="toolbar"><select class="control" style="max-width:240px" onchange="selectModel(this.value)">${activeModels().map(x=>`<option value="${x.id}" ${m.id===x.id?'selected':''}>${x.name} · ${x.width}×${x.length} cm</option>`).join('')}</select><div class="canvas-tools"><div><button class="tool ${state.tool==='draw'?'selected':''}" onclick="state.tool='draw';render()">Pintar</button><button class="tool ${state.tool==='erase'?'selected':''}" onclick="state.tool='erase';render()">Borrar</button></div><div><button class="tool" onclick="undo()">↶</button><button class="tool" onclick="redo()">↷</button><button class="tool" onclick="resetDesign()">Reiniciar</button></div></div></div><p class="notice">Elegí un color y tocá o hacé clic en las celdas para dibujar. Área máxima: <b>30 m de ancho × 30 m de largo</b> (${maxTiles.toLocaleString('es-AR')} baldosas de este modelo).</p><div class="color-palette">${m.colors.map(id=>`<button class="color-choice ${state.color===id?'selected':''}" title="${col(id).name}" style="background:${col(id).hex}" onclick="state.color='${id}';render()"></button>`).join('')}</div><div class="grid-wrap"><div class="floor-grid" id="floor" style="grid-template-columns:repeat(${cols},20px);grid-template-rows:repeat(${rows},20px)">${cells}</div></div></section><aside class="panel stats"><h3>Resumen del proyecto</h3><div class="stat"><span>Modelo</span><b>${m.name}</b></div><div class="stat"><span>Superficie</span><b>${area.toFixed(2)} m²</b></div><div class="stat"><span>Baldosas dibujadas</span><b>${used}</b></div>${by.map(([id,n])=>`<div class="stat"><span class="color-count"><i class="dot" style="background:${col(id).hex}"></i>${col(id).name}</span><b>${n}</b></div>`).join('')}<div class="stat"><span>Desperdicio (${db.waste}%)</span><b>+${extra}</b></div><div class="stat"><span>Total recomendado</span><b>${total}</b></div><div class="stat"><span>Precio unitario</span><b>${money(m.price)}</b></div><div class="stat total"><span>Estimado</span><span>${money(total*m.price)}</span></div><button class="primary" style="width:100%;margin-top:12px" onclick="addProject()" ${!used?'disabled':''}>Agregar proyecto al carrito</button></aside></div></main>`;
};
