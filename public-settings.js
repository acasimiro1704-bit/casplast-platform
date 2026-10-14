/* Textos iniciales compartidos por la web, el administrador y el servidor. */
(()=>{
const defaults={
 usesNav:"Dónde usarlos",
 usesKicker:"ESPACIOS Y POSIBILIDADES",
 usesTitle:"Un piso, muchos espacios.",
 usesIntro:"Descubrí ideas para tu próximo proyecto con CASPLAST. El modelo adecuado depende de la base, el tránsito y las condiciones de cada lugar: consultanos antes de elegir.",
 uses1Title:"Garajes y cocheras",
 uses1Text:"Dale identidad al lugar donde guardás tu auto o moto. Combiná colores para distinguir el estacionamiento y los sectores de paso.",
 uses2Title:"Detailing y estética vehicular",
 uses2Text:"Una propuesta para presentar tu trabajo con una imagen cuidada. Si hay agua, productos de limpieza o equipos, revisemos juntos el modelo y la base.",
 uses3Title:"Locales y salas de exhibición",
 uses3Text:"Destacá vehículos, productos o un sector de tu comercio con un diseño que acompañe la identidad de tu marca.",
 uses4Title:"Stands, ferias y exposiciones",
 uses4Text:"Creá un espacio de presentación reconocible. Contanos cómo es el lugar, cuánto dura el evento y qué se va a apoyar sobre el piso.",
 uses5Title:"Talleres y espacios de trabajo",
 uses5Text:"Organizá visualmente tu espacio. Consultanos por las cargas, herramientas, ruedas y sustancias que habrá en contacto con las baldosas.",
 uses6Title:"Patios, galerías y terrazas",
 uses6Text:"También podés evaluar un proyecto al aire libre. Confirmá la aptitud del modelo para exterior y sol, el drenaje y el estado de la base.",
 usesNoteTitle:"Cada espacio necesita su modelo",
 usesNote:"Estas ideas son orientativas, no una garantía de aptitud para cualquier uso. Para gimnasios, zonas de pileta, cargas puntuales o maquinaria, pedinos una evaluación específica. No todos los modelos tienen las mismas prestaciones.",
 usesContact:"Consultar mi espacio",
 usesCatalog:"Ver modelos",
 usesInstallation:"Cómo se instalan",
 attribute1:'+1 tonelada/m²',attribute2:'Fabricación propia',attribute3:'Sin mínimo de compra',attribute4:'Envíos a todo el país',
 installTitle:'Instalá tu piso, paso a paso.',
 installIntro:'Una buena base y todas las baldosas orientadas igual: esas son las claves para empezar bien.',
 installBaseTitle:'Primero, revisá la base',
 installBaseText:'Podés instalar sobre contrapiso, carpeta o cerámicos, siempre que estén firmes, limpios y lo más parejos posible. Repará pozos profundos y piezas flojas antes de empezar. Las baldosas no nivelan el piso de abajo.',
 installDrainTitle:'Pensá por dónde sale el agua',
 installDrainText:'Si el espacio se moja, recomendamos una buena caída hacia el desagüe, sin sectores donde se acumule agua. La pendiente la tiene que tener la base: el piso CASPLAST no la crea ni reemplaza una impermeabilización.',
 installPatternTitle:'Mantené siempre el mismo patrón',
 installPatternText:'Ubicá los encastres visibles hacia la derecha y abajo, o hacia la izquierda y abajo, según el modelo y desde dónde empieces. Probá unas piezas primero y mantené esa orientación en todo el piso; no gires baldosas sueltas.',
 installRightLabel:'Derecha y abajo',installLeftLabel:'Izquierda y abajo',
 installDiagramCaption:'Esquema orientativo: los bordes destacados representan los encastres. Elegí una orientación y repetila; verificá el modelo antes de armar.',
 installRowsTitle:'Armá por filas y controlá la línea',
 installRowsText:'Tomá una referencia recta. Alineá los encastres y uní las piezas sin forzarlas. Revisá el dibujo y la alineación a medida que avanzás. Antes de recortar, consultanos la separación necesaria junto a paredes y obstáculos para tu modelo.',
 installCutTitle:'Medí, marcá y después recortá',
 installCutText:'Dejá los cortes de los bordes para el final y conservá el encastre que necesitás unir. Podés usar una caladora con hoja apta para plástico. Si usás amoladora, confirmá la compatibilidad del disco con el plástico y la herramienta; no adaptes discos de sierra dentados. Sujetá la pieza, usá las protecciones indicadas por el fabricante y pedí ayuda si no tenés experiencia.',
 installSurplusTitle:'Aprovechá los sobrantes',
 installSurplusText:'Antes de descartar un recorte, fijate si sirve en otro borde y conserva el encastre necesario. No todos se pueden reutilizar. Guardá las baldosas enteras sobrantes para ajustes o reposiciones y separalas por modelo y color.',
 installNote:'¿Tu piso tiene desniveles o no sabés por dónde empezar? Mandanos una foto y las medidas. Te ayudamos a revisar el caso antes de instalar.'
};
if(typeof module!=='undefined'&&module.exports)module.exports=defaults;
else window.casplastContentDefaults=Object.freeze(defaults);
})();
(()=>{
const esc=customerSafe;let bannerImages=[],projectImages=[],uploading=false;
const defaults={backgroundColor:'#f3f5f2',menuColor:'#101510',buttonColor:'#237a36',bannerColor:'#182019'};
const validImage=v=>/^tile-images\/[a-zA-Z0-9-]+\.jpg$/.test(v||'');
const isVideo=v=>/^banner-media\/[a-zA-Z0-9-]+\.(mp4|webm)$/.test(v||'');
const validBanner=v=>v==='casplast-banner.png'||validImage(v)||isVideo(v);
const instagramDefaults=['https://www.instagram.com/reel/DVwYoQICcfc/','https://www.instagram.com/reel/DbBo_6_JV9s/','https://www.instagram.com/reel/DVZqVxWia2_/'];
function instagramUrl(value){
 try{const u=new URL(String(value||'').trim());if(u.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(u.hostname)||u.port||u.username||u.password)return '';const match=u.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]{1,100})\/?$/);return match?'https://www.instagram.com/'+match[1]+'/'+match[2]+'/':''}catch{return ''}
}

function settingsPage(){const c=db.publicSettings||{};bannerImages=(Array.isArray(c.bannerImages)?c.bannerImages:[c.bannerImage]).filter(validBanner).slice(0,10);if(!bannerImages.length)bannerImages=['casplast-banner.png'];
projectImages=(Array.isArray(c.projectImages)?c.projectImages:bannerImages.filter(validImage)).filter(validImage).slice(0,3);
const textInput=(name,label,value)=>`<label>${label}<input name="${name}" value="${esc(c[name]??value)}" maxlength="500"></label>`;
const input=(name,label,value)=>`<label>${label}<input name="${name}" value="${esc(c[name]||value||'')}" maxlength="500"></label>`;
return `<div class="heading"><h2>Configuraciones</h2><a class="tool" href="index.html" target="_blank" rel="noopener">Ver web pública ↗</a></div>
<form class="panel" id="public-settings-form">
<style>#public-settings-form{font-family:Arial,Helvetica,sans-serif}#public-settings-form textarea{font:inherit;padding:12px;border:1px solid #cbd2d9;border-radius:4px}#public-settings-form h3{margin:30px 0 14px}#public-settings-form label{display:block;font-size:14px}#public-settings-form input,#public-settings-form textarea{display:block;width:100%;margin:7px 0 16px}#public-settings-form input[type=color]{height:46px;padding:4px}#public-settings-form .form-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#theme-preview{margin:20px 0;border:1px solid #cbd2d9;border-radius:8px;overflow:hidden}#theme-preview header{padding:16px;font-weight:bold;display:flex;justify-content:space-between}#theme-preview section{padding:24px;display:grid;grid-template-columns:1fr 100px;gap:20px}#theme-preview img{width:100%;height:160px;object-fit:contain}#theme-preview h4{font-size:24px;line-height:1.15;white-space:pre-line;margin:0 0 15px}#theme-preview p{font-size:14px;white-space:pre-line}#theme-preview span{display:inline-block;padding:10px;border-radius:4px;margin-top:12px}@media(max-width:600px){#public-settings-form .form-grid{grid-template-columns:1fr}}</style>
<h3>Información de la web</h3><div class="form-grid">
${input('whatsapp','WhatsApp (con código de país)')}${input('email','Email')}${input('address','Dirección')}${input('hours','Horario de atención')}</div>
<label>Quiénes somos<textarea name="about" rows="5" maxlength="5000">${esc(c.about||'En CASPLAST fabricamos baldosas plásticas encastrables. Combinamos modelos y colores para dar forma a espacios con identidad propia.')}</textarea></label>

<h3 class="full">Página: Dónde usarlos</h3>
<p class="full">Editá el nombre del menú, los títulos, las descripciones y los botones. Guardá configuraciones para publicar los cambios.</p>
${Object.entries(window.casplastContentDefaults).filter(([key])=>key.startsWith('uses')).map(([key,value])=>'<label>'+esc(({usesNav:'Nombre en el menú',usesKicker:'Antetítulo',usesTitle:'Título principal',usesIntro:'Introducción',usesNoteTitle:'Título de la aclaración',usesNote:'Aclaración de usos',usesContact:'Botón de consulta',usesCatalog:'Botón de catálogo',usesInstallation:'Enlace de instalación'})[key]||('Espacio '+key.match(/\d+/)?.[0]+' · '+(key.endsWith('Title')?'Título':'Descripción')))+'<textarea name="'+key+'" rows="'+(key.endsWith('Text')?3:2)+'" maxlength="1200">'+esc(c[key]??value)+'</textarea></label>').join('')}
<h3>Franja de atributos</h3><div class="form-grid">${[1,2,3,4].map(i=>textInput('attribute'+i,'Atributo '+i,window.casplastContentDefaults['attribute'+i])).join('')}</div>
<h3>Página de instalación</h3><p>Estos textos aparecen en Instalación, en el menú de la web. Podés editarlos y guardar. Confirmá las indicaciones técnicas para cada modelo antes de modificarlas.</p>
${Object.entries(window.casplastContentDefaults).filter(([key])=>key.startsWith('install')).map(([key,value])=>'<label>'+esc(({installTitle:'Título principal',installIntro:'Introducción',installBaseTitle:'1 · Título: base',installBaseText:'1 · Texto: base',installDrainTitle:'2 · Título: agua y caída',installDrainText:'2 · Texto: agua y caída',installPatternTitle:'3 · Título: orientación',installPatternText:'3 · Texto: orientación',installRightLabel:'Esquema: derecha',installLeftLabel:'Esquema: izquierda',installDiagramCaption:'Aclaración del esquema',installRowsTitle:'4 · Título: armado',installRowsText:'4 · Texto: armado',installCutTitle:'5 · Título: recortes',installCutText:'5 · Texto: recortes y seguridad',installSurplusTitle:'6 · Título: sobrantes',installSurplusText:'6 · Texto: sobrantes',installNote:'Consulta final'})[key])+'<textarea name="'+key+'" rows="'+(key.endsWith('Text')?4:2)+'" maxlength="1200">'+esc(c[key]??value)+'</textarea></label>').join('')}

<h3>Banner principal</h3><p>Personalizá la portada de Quiénes somos. Las fotos y videos cubren el fondo del banner y cambian cada 5 segundos. Usá imágenes horizontales: los bordes pueden recortarse para llenar la pantalla. Videos MP4 o WebM hasta 30 MB, sin sonido.</p>
<div class="form-grid">${input('bannerTitle','Título del banner','Tu espacio. Tu diseño.')}${input('bannerButton','Texto del botón al catálogo','Explorar catálogo')}</div>
<label>Descripción del banner<textarea name="bannerText" rows="3" maxlength="1500">${esc(c.bannerText||'Dale identidad a cada metro cuadrado. Elegí tu modelo, combiná colores y creá un piso a tu medida.')}</textarea></label>
<label>Texto secundario del banner<input name="bannerNote" maxlength="200" value="${esc(c.bannerNote??'MODELOS + COLORES + POSIBILIDADES')}"></label><p class="muted">Aparece debajo del botón del banner. Dejalo vacío para ocultarlo.</p>
<label>Pie de foto del carrusel<input name="bannerCaption" maxlength="160" value="${esc(c.bannerCaption??'DISEÑÁ DESDE EL PISO.')}"></label><p class="muted">Texto visible sobre el banner. Dejalo vacío para ocultarlo.</p>
<label>Carrusel del banner: agregar fotos o videos (máximo 10)<input id="public-banner-file" type="file" multiple accept="image/png,image/jpeg,image/webp,video/mp4,video/webm" onchange="uploadPublicBanner(this)"></label><p id="banner-count"></p><div id="banner-gallery" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:12px"></div>
<button type="button" class="tool" onclick="restorePublicBanner()">Usar imagen CASPLAST original</button>
<h3>Proyectos reales — fotos de la web</h3><p>Hasta 3 fotos independientes del carrusel. Podés reemplazarlas o quitarlas. Si quitás todas, la sección se oculta. Guardá para aplicar.</p><div id="project-gallery" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px"></div>
<h3>Videos de Instagram</h3>
<div class="form-grid">${textInput('instagramKicker','Texto superior de videos','CASPLAST EN INSTAGRAM')}${textInput('instagramTitle','Título de videos','Nuestros trabajos en video.')}</div>
${textInput('instagramText','Descripción de videos','Conocé nuestros pisos en acción.')}<p class="muted">Dejá un texto vacío para ocultarlo.</p><p>Se muestran en la sección de videos de la página principal. Pegá hasta 3 enlaces de publicaciones o reels públicos; no enlaces al perfil ni historias. Instagram debe permitir insertar esas publicaciones en otras webs.</p>
${[1,2,3].map(i=>'<label>Enlace de Instagram '+i+'<input type="url" name="instagramUrl'+i+'" maxlength="500" value="'+esc(c['instagramUrl'+i]??instagramDefaults[i-1])+'" placeholder="https://www.instagram.com/reel/.../"></label>').join('')}
<p class="muted">Dejá un campo vacío para quitar ese video. Si dejás los tres vacíos, la sección no aparece. La reproducción depende de Instagram.</p><h3>Colores del sitio</h3><div class="form-grid">${Object.entries({backgroundColor:'Fondo de la web',menuColor:'Fondo del menú y pie',buttonColor:'Botones',bannerColor:'Fondo del banner'}).map(([key,label])=>`<label>${label}<input type="color" name="${key}" value="${/^#[0-9a-f]{6}$/i.test(c[key]||'')?c[key]:defaults[key]}"></label>`).join('')}</div>
<p>El color del texto se adapta automáticamente para conservar el contraste.</p><button type="button" class="tool" onclick="resetPublicColors()">Restablecer colores del nuevo diseño</button>
<h3>Vista previa del diseño</h3><div id="theme-preview" aria-label="Vista previa"></div>
<p id="public-settings-notice" role="status"></p><button class="primary" type="submit">Guardar configuraciones</button>
${typeof exportServerBackup==='function'?`<h3>Datos y respaldo</h3><p>Exportá una copia de los datos del servidor. La importación inicial solo se permite si está vacío; las fotos se trasladan por separado.</p><button type="button" class="tool" onclick="exportServerBackup()">Exportar datos</button> <button type="button" class="tool" onclick="importLegacyData()">Importar datos de este navegador</button><label>Importar archivo JSON<input type="file" accept=".json,application/json" onchange="if(this.files[0])importLegacyData(this.files[0])"></label>`:''}</form>`}
function ink(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.179?'#101510':'#ffffff'}
window.previewPublicTheme=function(){const f=document.getElementById('public-settings-form'),p=document.getElementById('theme-preview');if(!f||!p)return;const v=Object.fromEntries(new FormData(f));p.style.background=v.backgroundColor;p.innerHTML=`<header style="background:${v.menuColor};color:${ink(v.menuColor)}">CASPLAST <small>Menú</small></header><section style="position:relative;isolation:isolate;display:block;overflow:hidden;background:#111;color:#fff;min-height:330px"><div style="position:relative;z-index:2;max-width:65%"><h4>${esc(v.bannerTitle)}</h4><p>${esc(v.bannerText)}</p><span style="background:${v.buttonColor};color:${ink(v.buttonColor)}">${esc(v.bannerButton)}</span><p style="overflow-wrap:anywhere;font-size:12px">${esc(v.bannerNote)}</p></div><div style="position:absolute;inset:0;z-index:0">${isVideo(bannerImages[0])?`<video src="${bannerImages[0]}" muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover"></video>`:`<img src="${bannerImages[0]||'casplast-banner.png'}" alt="Vista previa del banner" style="width:100%;height:100%;object-fit:cover">`}<div style="position:absolute;inset:0;background:linear-gradient(90deg,#000d,#0006)"></div></div><p style="position:relative;z-index:2;overflow-wrap:anywhere;margin-top:24px">${esc(v.bannerCaption)}</p></section><div style="padding:22px;color:${ink(v.backgroundColor)}">Contenido de la web</div>`};
window.restorePublicBanner=function(){if(uploading)return;bannerImages=['casplast-banner.png'];document.getElementById('public-banner-file').value='';renderBannerGallery();previewPublicTheme()};
window.resetPublicColors=function(){const f=document.getElementById('public-settings-form');for(const [k,v]of Object.entries(defaults))f.elements[k].value=v;previewPublicTheme()};

function renderBannerGallery(){
 const gallery=document.getElementById('banner-gallery');if(!gallery)return;
 document.getElementById('banner-count').textContent=bannerImages.length+' / 10 fotos o videos. Usá las flechas para elegir el orden. Guardá para aplicar.';
 gallery.innerHTML=bannerImages.map((url,i)=>'<div style="border:1px solid #cbd2d9;border-radius:6px;padding:10px">'+(isVideo(url)?'<video src="'+esc(url)+'" muted controls preload="metadata" style="width:100%;height:120px;object-fit:contain"></video>':'<img src="'+esc(url)+'" alt="Banner '+(i+1)+'" style="width:100%;height:120px;object-fit:contain">')+'<p>'+(isVideo(url)?'Video ':'Foto ')+(i+1)+'</p><button type="button" class="tool" data-move="'+i+'" data-step="-1" aria-label="Mover foto '+(i+1)+' antes" '+(!i||uploading?'disabled':'')+'>←</button> <button type="button" class="tool" data-move="'+i+'" data-step="1" aria-label="Mover foto '+(i+1)+' después" '+(i===bannerImages.length-1||uploading?'disabled':'')+'>→</button> <button type="button" class="tool" data-remove="'+i+'" '+(uploading?'disabled':'')+'>Quitar</button></div>').join('');
 gallery.onclick=e=>{if(uploading)return;const remove=e.target.closest('[data-remove]'),move=e.target.closest('[data-move]');if(remove)bannerImages.splice(Number(remove.dataset.remove),1);if(move){const i=Number(move.dataset.move),j=i+Number(move.dataset.step);if(j>=0&&j<bannerImages.length)[bannerImages[i],bannerImages[j]]=[bannerImages[j],bannerImages[i]]}renderBannerGallery();previewPublicTheme()};
 document.getElementById('public-banner-file').disabled=uploading||bannerImages.length>=10;
}
window.uploadPublicBanner=async function(input){
 const selected=Array.from(input.files||[]);if(!selected.length||uploading)return;
 const notice=document.getElementById('public-settings-notice');
 if(selected.length+bannerImages.length>10){notice.textContent='Máximo 10 fotos o videos. Quitá una foto o seleccioná menos archivos.';input.value='';return}
 uploading=true;renderBannerGallery();renderProjectGallery();let added=0;
 try{for(const file of selected){
 notice.textContent='Cargando archivo '+(added+1)+' de '+selected.length+'…';
 if(['video/mp4','video/webm'].includes(file.type)){
 if(file.size>30*1024*1024)throw Error('Elegí videos de hasta 30 MB.');
 const response=await fetch('/api/banner-video',{method:'POST',headers:{'Content-Type':file.type},body:file});
 if(!response.ok)throw Error('No se pudo cargar el video. Verificá el formato y que el servidor esté actualizado.');
 const result=await response.json();if(!isVideo(result.url))throw Error('Respuesta de video inválida.');
 bannerImages.push(result.url);added++;renderBannerGallery();previewPublicTheme();continue;
 }
 if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw Error('Usá fotos PNG, JPEG, WebP o videos MP4/WebM.');
 if(file.size>20*1024*1024)throw Error('Elegí imágenes de menos de 20 MB.');
 const bitmap=await createImageBitmap(file),scale=Math.min(1,1920/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
 const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.9));
 if(!blob||blob.size>2*1024*1024)throw Error('La imagen es muy pesada. Elegí otra de menor tamaño.');
 const response=await fetch('/api/tile-image',{method:'POST',body:blob});if(!response.ok)throw Error('No se pudo guardar la imagen.');
 const result=await response.json();if(!validImage(result.url))throw Error('Respuesta de imagen inválida.');
 bannerImages.push(result.url);added++;renderBannerGallery();previewPublicTheme();
 }notice.textContent='Archivos listos. Guardá para aplicar.';
 }catch(error){notice.textContent=error.message+(added?' Se agregaron '+added+' archivos; guardá para conservarlas.':'')}
 finally{uploading=false;input.value='';renderBannerGallery();renderProjectGallery()}
};

function renderProjectGallery(){
 const gallery=document.getElementById('project-gallery');if(!gallery)return;
 gallery.innerHTML=[0,1,2].map(i=>'<div style="border:1px solid #cbd2d9;border-radius:6px;padding:12px"><strong>Proyecto '+(i+1)+'</strong>'+(projectImages[i]?'<img src="'+esc(projectImages[i])+'" alt="Proyecto '+(i+1)+'" style="width:100%;height:150px;object-fit:cover;margin:12px 0">':'<p>Sin imagen</p>')+'<label>'+(projectImages[i]?'Reemplazar foto':'Agregar foto')+'<input type="file" accept="image/png,image/jpeg,image/webp" data-project-upload="'+i+'" '+(uploading?'disabled':'')+'></label><button type="button" class="tool" data-project-remove="'+i+'" '+(!projectImages[i]||uploading?'disabled':'')+'>Quitar foto</button></div>').join('');
 gallery.onclick=e=>{const b=e.target.closest('[data-project-remove]');if(b&&!uploading){projectImages[Number(b.dataset.projectRemove)]='';renderProjectGallery()}};
 gallery.onchange=async e=>{
 const i=Number(e.target.dataset.projectUpload),file=e.target.files?.[0];if(!file||uploading)return;
 const notice=document.getElementById('public-settings-notice');uploading=true;renderProjectGallery();renderBannerGallery();let bitmap;
 try{
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>20*1024*1024)throw Error('Elegí una foto PNG, JPEG o WebP de hasta 20 MB.');
 notice.textContent='Cargando foto de proyecto…';
 bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas'),scale=Math.min(1,1920/Math.max(bitmap.width,bitmap.height));
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
 const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.9));if(!blob||blob.size>2*1024*1024)throw Error('La foto es demasiado pesada. Elegí otra más pequeña.');
 const response=await fetch('/api/tile-image',{method:'POST',body:blob});if(!response.ok)throw Error('No se pudo guardar la foto.');
 const data=await response.json();if(!validImage(data.url))throw Error('Foto inválida.');
 projectImages[i]=data.url;notice.textContent='Foto de proyecto lista. Guardá configuraciones para aplicar.';
 }catch(error){notice.textContent=error.message}finally{bitmap?.close();uploading=false;renderProjectGallery();renderBannerGallery()}
 };
}

const oldAdmin=admin;admin=function(){if(state.admin==='public-settings')return `<main class="shell"><div class="page-head"><h1>Administración.</h1></div><div class="admin">${adminSidebar()}<section>${settingsPage()}</section></div></main>`;return oldAdmin()};
const oldRender=render;render=function(){oldRender();const side=document.querySelector('.admin .side');if(side&&!side.querySelector('[data-public-settings]')){const button=document.createElement('button');button.textContent='Configuraciones';button.dataset.publicSettings='1';button.classList.toggle('active',state.admin==='public-settings'&&state.page==='admin');button.onclick=()=>{state.page='admin';state.admin='public-settings';render()};side.insertBefore(button,side.lastElementChild)}
const form=document.getElementById('public-settings-form');if(form){renderProjectGallery();renderBannerGallery();previewPublicTheme();form.addEventListener('input',previewPublicTheme);form.onsubmit=async e=>{e.preventDefault();if(uploading)return alert('Esperá a que termine de cargar los archivos.');const values=Object.fromEntries(new FormData(form));for(const i of [1,2,3]){const key='instagramUrl'+i,raw=String(values[key]||'').trim();if(raw&&!instagramUrl(raw)){document.getElementById('public-settings-notice').textContent='Revisá el enlace de Instagram '+i+': debe ser una URL HTTPS de una publicación o reel, no de un perfil.';form.elements[key].focus();return}values[key]=instagramUrl(raw)} if(values.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)){document.getElementById('public-settings-notice').textContent='Revisá el email.';return}db.publicSettings={...db.publicSettings,...values,projectImages:projectImages.filter(validImage),bannerImages:[...bannerImages],bannerImage:bannerImages.find(validImage)||'',backgroundImage:''};save();try{if(window.flushServerSave)await window.flushServerSave();document.getElementById('public-settings-notice').textContent='Configuraciones guardadas. Los cambios ya están disponibles en la web.'}catch(error){document.getElementById('public-settings-notice').textContent=error.message}}}};render();
})();
