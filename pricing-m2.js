function modelPriceM2(m){return Number(m.pricePerM2 ?? (m.price/(m.width*m.length/10000)));}
// La tarifa se edita por m²; el cotizador conserva una celda por baldosa.
const openModelForM2=modelModal;
modelModal=function(id){openModelForM2(id);const m=db.models.find(x=>x.id===id),input=$('#mp');if(!input)return;input.value=m?modelPriceM2(m):'';const label=input.closest('label');if(label&&label.firstChild)label.firstChild.textContent='Precio por m²';};
const saveModelForM2=saveModel;
saveModel=function(id){const name=$('#mn')?.value?.trim(),priceM2=Number($('#mp')?.value);saveModelForM2(id);const m=db.models.find(x=>x.name===name);if(m&&priceM2>=0){m.pricePerM2=priceM2;m.price=priceM2*(m.width*m.length/10000);save();render();}};
const quoteBeforeM2=quote;
quote=function(){const m=model(),unitM2=modelPriceM2(m),total=cellCount()*(m.width*m.length/10000)*unitM2;const html=quoteBeforeM2();const details=`<div class="stat"><span>Precio por m²</span><b>${money(unitM2)}</b></div><div class="stat total"><span>Total del proyecto</span><span>${money(total)}</span></div>`;return html.replace(/<button class="primary" style="width:100%;margin-top:14px" onclick="downloadBudgetPDF\(\)"[^>]*>/,details+'$&');};
