// Fotos por modelo/color y presupuestos con instantánea independiente.
(() => {
const escape=customerSafe;
let draft={},catalogDraft={},busy=false;
const previousModal=modelModal;
modelModal=function(id){
 previousModal(id);draft={...(db.models.find(m=>m.id===id)?.tilePhotos||{})};catalogDraft={...(db.models.find(m=>m.id===id)?.catalogPhotos||{})};
 const box=document.createElement('section');box.className='tile-photo-editor';
 box.innerHTML='<h3>Fotos reales por color</h3><p>Cargá una sola foto completa, desde arriba y centrada. El catálogo conserva la imagen entera, incluidos los encastres; el cotizador mantiene su recorte cuadrado. Guardá el modelo para aplicar los cambios.</p>'+db.colors.map(c=>'<div style="display:inline-grid;gap:6px;margin:8px;width:190px"><strong>'+escape(c.name)+'</strong><div style="display:flex;gap:10px"><div><small>Catálogo</small><img id="catalog-photo-'+c.id+'" '+(catalogDraft[c.id]||draft[c.id]?'src="'+escape(catalogDraft[c.id]||draft[c.id])+'"':'')+' style="display:block;width:85px;height:85px;object-fit:contain;background:#fff" alt="'+escape(c.name)+' completo"></div><div><small>Cotizador</small><img id="photo-'+c.id+'" '+(draft[c.id]?'src="'+escape(draft[c.id])+'"':'')+' style="display:block;width:85px;height:85px;object-fit:cover;background:'+c.hex+'" alt="'+escape(c.name)+' recortado"></div></div><label style="font-size:14px">Cargar foto de '+escape(c.name)+'<input type="file" accept="image/*" data-photo="'+c.id+'" style="max-width:100%"></label><button type="button" class="tool" data-remove="'+c.id+'">Quitar foto</button></div>').join('')+'<p class="photo-status" role="status"></p>';
 $('#modal .actions').before(box);
 box.onchange=async e=>{
 const id=e.target.dataset.photo,file=e.target.files?.[0];if(!id||!file)return;if(busy){e.target.value='';return alert('Esperá a que termine de cargar la foto anterior.')}
 busy=true;const status=box.querySelector('.photo-status');status.textContent='Preparando fotos para catálogo y cotizador…';
 let bitmap;
 try{
 if(file.size>20*1024*1024)throw Error('Elegí una foto de menos de 20 MB.');
 bitmap=await createImageBitmap(file);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
 const ctx=canvas.getContext('2d'),side=Math.min(bitmap.width,bitmap.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,512,512);ctx.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,512,512);
 const full=document.createElement('canvas'),scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));full.width=Math.max(1,Math.round(bitmap.width*scale));full.height=Math.max(1,Math.round(bitmap.height*scale));
 const fullCtx=full.getContext('2d');fullCtx.fillStyle='#fff';fullCtx.fillRect(0,0,full.width,full.height);fullCtx.drawImage(bitmap,0,0,full.width,full.height);
 bitmap.close();bitmap=null;
 const cropped=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.86));let original=await new Promise(r=>full.toBlob(r,'image/jpeg',.92));
 if(original?.size>2*1024*1024)original=await new Promise(r=>full.toBlob(r,'image/jpeg',.75));
 if(!cropped||!original||Math.max(cropped.size,original.size)>2*1024*1024)throw Error('La imagen es demasiado pesada. Elegí una de menor tamaño.');
 async function upload(blob){const response=await fetch('/api/tile-image',{method:'POST',body:blob});if(!response.ok)throw Error('No se pudo guardar la imagen.');const data=await response.json();if(!/^tile-images\/[a-zA-Z0-9-]+\.jpg$/.test(data.url||''))throw Error('Respuesta de imagen inválida.');return data.url}
 const [tileUrl,catalogUrl]=await Promise.all([upload(cropped),upload(original)]);
 if(!box.isConnected)return;
 draft[id]=tileUrl;catalogDraft[id]=catalogUrl;box.querySelector('[id="photo-'+id+'"]').src=tileUrl;box.querySelector('[id="catalog-photo-'+id+'"]').src=catalogUrl;
 status.textContent='Foto lista: catálogo completo y cotizador cuadrado. Guardá el modelo para aplicar.';
 }catch(error){status.textContent=error.message;alert(error.message)}finally{bitmap?.close();busy=false;e.target.value=''}
 };
 box.onclick=e=>{const id=e.target.dataset.remove;if(id&&!busy){delete draft[id];delete catalogDraft[id];box.querySelector('[id="photo-'+id+'"]').removeAttribute('src');box.querySelector('[id="catalog-photo-'+id+'"]').removeAttribute('src');box.querySelector('.photo-status').textContent='Foto quitada de ambas vistas. Guardá el modelo para aplicar.'}};
};
const previousSave=saveModel;
saveModel=function(id){if(busy)return alert('Esperá a que termine de cargar la foto.');const photos={...draft},catalogPhotos={...catalogDraft};previousSave(id);if(!$('#modal')){const m=id?db.models.find(m=>m.id===id):db.models.at(-1);m.tilePhotos=photos;m.catalogPhotos=catalogPhotos;save()}};
state.realistic=true;
function decorate(){if(state.page!=='quote')return;const m=model();if(!m)return;document.querySelectorAll('[data-cell],[data-surplus]').forEach(cell=>{const id=cell.dataset.cell!==undefined?state.cells[cell.dataset.cell]:state.surplusCells[cell.dataset.surplus],url=state.realistic&&m.tilePhotos?.[id];cell.style.backgroundImage=url?`url("${url}")`:'';cell.style.backgroundSize='100% 100%';cell.classList.toggle('real-tile',Boolean(url))});const bar=document.querySelector('.zoom-row');if(bar&&!bar.querySelector('[data-realistic]')){const button=document.createElement('button');button.className='tool';button.dataset.realistic='1';button.textContent=state.realistic?'Vista realista ✓':'Vista por colores';button.onclick=()=>{state.realistic=!state.realistic;render()};bar.append(button)}}
const oldRender=render;render=function(){oldRender();decorate()};const oldApply=applyCell;applyCell=function(cell){oldApply(cell);const url=state.realistic&&model().tilePhotos?.[state.cells[cell.dataset.cell]];cell.style.backgroundImage=url?`url("${url}")`:'';cell.style.backgroundSize='100% 100%';cell.classList.toggle('real-tile',Boolean(url))};
async function exportBudget(b){
 const pictures={};await Promise.all((b.colors||[]).map(async c=>{const url=b.model.tilePhotos?.[c.id];if(url){try{const im=new Image();im.src=url;await im.decode();pictures[c.id]=im}catch{}}}));
 const pages=[];let canvas,ctx,y;function page(){canvas=document.createElement('canvas');canvas.width=3570;canvas.height=5052;ctx=canvas.getContext('2d');ctx.scale(3,3);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.fillStyle='#fff';ctx.fillRect(0,0,1190,1684);ctx.fillStyle='#000';ctx.fillRect(0,0,1190,130);ctx.fillStyle='#fff';ctx.font='bold 40px Arial';ctx.fillText('CASPLAST',70,65);ctx.font='20px Arial';ctx.fillText('PRESUPUESTO #'+b.id,70,103);pages.push(canvas);y=180}page();
 function heading(s){ctx.fillStyle='#111';ctx.font='bold 28px Arial';ctx.fillText(s,70,y);y+=35}
 function row(label,value){const words=String(value).split(' '),lines=[''];ctx.font='21px Arial';for(const word of words){let last=lines.length-1;if(ctx.measureText(lines[last]+word).width>640)lines.push('');lines[lines.length-1]+=word+' '}const height=Math.max(40,lines.length*27+10);if(y+height>1570){page()}ctx.fillStyle='#f2f5f7';ctx.fillRect(70,y-24,1050,height);ctx.fillStyle='#18222a';ctx.fillText(label,82,y);lines.forEach((line,i)=>ctx.fillText(line,430,y+i*27));y+=height+3}
 heading('Resumen del proyecto');
 const tile=b.model.width*b.model.length/10000,p=Object.values(b.cells||{}),s=Object.values(b.surplusCells||{}),all=[...p,...s];
 const details=[['Modelo',b.model.name],['Superficie total',(all.length*tile).toFixed(2)+' m²'],['Baldosas proyecto',p.length],['Baldosas sobrantes',s.length],['Baldosas totales',all.length]];
 for(const c of b.colors){const n=all.filter(id=>id===c.id).length;if(n)details.push([c.name,n+' u. · '+(n*tile).toFixed(2)+' m²'])}
 for(const c of b.colors){const n=s.filter(id=>id===c.id).length;if(n)details.push(['Sobrante '+c.name,n+' u. · '+(n*tile).toFixed(2)+' m²'])}
 const groups=[{title:'01 · Datos del cliente',rows:[['Cliente',b.customer?.name||'-'],['Teléfono',b.customer?.phone||'-'],['Dirección',b.customer?.address||'-']]},{title:'02 · Modelo, superficie y baldosas',rows:details},{title:'03 · Importe del presupuesto',rows:[['Precio por m²',money(b.rate)],['Total del proyecto',money(b.total)]]}];
 // Repartir toda la primera página entre los tres bloques, incluyendo texto largo.
 const wrap=value=>{const lines=[''];for(const char of String(value)){if(ctx.measureText(lines.at(-1)+char).width>650)lines.push('');lines[lines.length-1]+=char}return lines};
 let font=25,units;
 do{ctx.font=font+'px Arial';units=0;for(const group of groups)for(const r of group.rows){r[2]=wrap(r[1]);units+=Math.max(1,r[2].length)}if(units*font*1.25<1100||font<=14)break;font--}while(true);
 const rowUnit=(1350-groups.length*78)/units;
 y=235;
 for(const group of groups){ctx.fillStyle='#102b3d';ctx.fillRect(70,y,1050,52);ctx.fillStyle='#fff';ctx.font='bold 25px Arial';ctx.fillText(group.title,90,y+35);y+=52;
  group.rows.forEach((r,index)=>{const height=Math.max(1,r[2].length)*rowUnit,total=r[0]==='Total del proyecto';ctx.fillStyle=total?'#e4eff6':index%2?'#fff':'#f3f6f8';ctx.fillRect(70,y,1050,height);ctx.fillStyle='#18222a';ctx.font=(total?'bold ':'')+font+'px Arial';const baseline=y+(height-r[2].length*font*1.25)/2+font;ctx.fillText(r[0],90,baseline,315);r[2].forEach((line,i)=>ctx.fillText(line,435,baseline+i*font*1.25));y+=height});y+=26;
 }
 function design(cells,cols,title){
  const ids=Object.keys(cells).map(Number);
  page(); heading(title);
  const availableWidth=1110,availableHeight=1400,padding=8;
  if(!ids.length){ctx.fillStyle='#65717c';ctx.font='22px Arial';ctx.fillText('Sin baldosas sobrantes',70,y+35);return}
  const xs=ids.map(i=>i%cols),ys=ids.map(i=>Math.floor(i/cols));
  const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0+1,h=Math.max(...ys)-y0+1;
  const scale=Math.min((availableWidth-padding*2)/w,(availableHeight-padding*2)/h);
  const drawingWidth=w*scale,drawingHeight=h*scale;
  const frameWidth=drawingWidth+padding*2,frameHeight=drawingHeight+padding*2;
  const frameLeft=(1190-frameWidth)/2,frameTop=y+10;
  ctx.strokeStyle='#c5ced5';ctx.lineWidth=2;ctx.strokeRect(frameLeft,frameTop,frameWidth,frameHeight);
  const left=frameLeft+padding,top=frameTop+padding;
  for(const i of ids){const id=cells[i],x=left+(i%cols-x0)*scale,t=top+(Math.floor(i/cols)-y0)*scale;
    ctx.fillStyle=b.colors.find(c=>c.id===id)?.hex||'#ccc';ctx.fillRect(x,t,scale,scale);
    if(pictures[id]){ctx.drawImage(pictures[id],x,t,scale+.1,scale+.1)}
    else{ctx.strokeStyle='#aab4bd';ctx.lineWidth=Math.min(.8,scale/12);ctx.strokeRect(x,t,scale,scale)}
  }
  y=frameTop+frameHeight+20;
 }
 design(b.cells,Math.floor(3000/b.model.width),'Diseño visual: Proyecto');design(b.surplusCells||{},Math.floor(500/b.model.width),'Diseño visual: Sobrantes');
 // JPEG por página: tamaño acotado, fotos y tipografía idénticas a la vista previa.
 const objects=[null,'<< /Type /Catalog /Pages 2 0 R >>',''];const kids=[];for(const c of pages){const pageId=objects.length,imageId=pageId+1,contentId=pageId+2;kids.push(pageId+' 0 R');const bytes=atob(c.toDataURL('image/jpeg',.98).split(',')[1]),stream='q 595 0 0 842 0 0 cm /Im0 Do Q';objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,`<< /Type /XObject /Subtype /Image /Width ${c.width} /Height ${c.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n${bytes}\nendstream`,`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`)}objects[2]=`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`;let pdf='%PDF-1.4\n',offset=[0];for(let i=1;i<objects.length;i++){offset[i]=pdf.length;pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`}const start=pdf.length;pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`+offset.slice(1).map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+`trailer << /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;const blob=new Blob([Uint8Array.from(pdf,c=>c.charCodeAt(0))],{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='presupuesto-'+b.id+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),3000);
}
downloadBudgetPDF=async function(){if(!['name','phone','address'].every(k=>state.customer?.[k]?.trim()))return alert('Completá nombre, teléfono y dirección.');const m=model(),rate=modelPriceM2(m)+Number(m.uvExtraPerM2||0),n=Object.keys(state.cells).length+Object.keys(state.surplusCells||{}).length;if(!n)return alert('Dibujá al menos una baldosa.');const b={id:String(Date.now()),date:new Date().toLocaleString('es-AR'),status:'Pendiente',customer:{...state.customer},model:JSON.parse(JSON.stringify(m)),cells:{...state.cells},surplusCells:{...state.surplusCells},colors:db.colors.map(c=>({...c})),rate,total:n*m.width*m.length/10000*rate};try{await exportBudget(b);db.budgets.unshift(b);save()}catch(e){alert('No se pudo generar el PDF: '+e.message)}};
viewBudgetPDF=async function(id){const b=db.budgets.find(b=>b.id===id);if(!b)return;const copy=JSON.parse(JSON.stringify(b));copy.total??=budgetGrandTotal(copy);copy.rate??=copy.total/Math.max(budgetSurface(copy),.0001);try{await exportBudget(copy)}catch(e){alert(e.message)}};
const css=document.createElement('style');css.textContent='.real-tile{border:0!important;border-radius:0!important;position:relative;width:calc(100% + 2px)!important;height:calc(100% + 2px)!important;margin:-1px} .modal-box:has(.tile-photo-editor){max-height:90vh;overflow:auto;max-width:760px}.tile-photo-editor{margin-top:20px}.tile-photo-editor input{max-width:120px;font-size:11px}';document.head.append(css);render();
})();
