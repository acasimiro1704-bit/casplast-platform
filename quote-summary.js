// Resumen operativo: solo datos de fabricación y superficie por color.
const quoteWithFullSummary = quote;
quote = function(){
  const m=model(), tileM2=m.width*m.length/10000, used=cellCount();
  const lines=m.colors.map(id=>[id,Object.values(state.cells).filter(x=>x===id).length]).filter(([,n])=>n).map(([id,n])=>`<div class="stat"><span class="color-count"><i class="dot" style="background:${col(id).hex}"></i>${col(id).name}</span><b>${n} u. · ${(n*tileM2).toFixed(2)} m²</b></div>`).join('');
  const summary=`<aside class="panel stats"><h3>Resumen del proyecto</h3><div class="stat"><span>Modelo</span><b>${m.name}</b></div><div class="stat"><span>Superficie</span><b>${(used*tileM2).toFixed(2)} m²</b></div><div class="stat"><span>Baldosas dibujadas</span><b>${used}</b></div>${lines}<button class="primary" style="width:100%;margin-top:14px" onclick="downloadBudgetPDF()" ${!used?'disabled':''}>Imprimir presupuesto (PDF)</button></aside>`;
  return quoteWithFullSummary().replace(/<aside class="panel stats">[\s\S]*?<\/aside>/,summary);
};
