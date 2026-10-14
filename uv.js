// Costo adicional UV por m², configurable en cada modelo.
const openModelWithUv=modelModal;
modelModal=function(id){openModelWithUv(id);const m=db.models.find(x=>x.id===id)||{};const price=$('#mp');price.closest('label').insertAdjacentHTML('afterend',`<label>Costo extra UV por m²<input id="uvExtra" type="number" min="0" step=".01" value="${m.uvExtraPerM2||0}"></label>`)};
const saveModelWithUv=saveModel;
saveModel=function(id){const name=$('#mn')?.value?.trim(),uv=Number($('#uvExtra')?.value||0);saveModelWithUv(id);const m=db.models.find(x=>x.name===name);if(m){m.uvExtraPerM2=uv;save();render();}};
const quoteWithUvBase=quote;
quote=function(){const m=model(),base=modelPriceM2(m),uv=Number(m.uvExtraPerM2||0),area=cellCount()*(m.width*m.length/10000),html=quoteWithUvBase();const line=`<div class="stat"><span>Precio por m²</span><b>${money(base)}</b></div><div class="stat"><span>Extra UV por m²</span><b>${money(uv)}</b></div><div class="stat total"><span>Total del proyecto</span><span>${money(area*(base+uv))}</span></div>`;return html.replace(/<div class="stat"><span>Precio por m²<\/span><b>.*?<\/b><\/div><div class="stat total"><span>Total del proyecto<\/span><span>.*?<\/span><\/div>/,line)};
