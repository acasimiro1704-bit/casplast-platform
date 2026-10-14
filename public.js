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
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let shared={models:[],colors:[],publicSettings:{}};const read=()=>shared;let catalogError='';
const loader=document.getElementById('site-loader');let loadingFinished=false;
function finishLoading(){if(loadingFinished)return;loadingFinished=true;loader?.remove()}
setTimeout(finishLoading,9000);
let refreshPending=false,lastRefresh=0;
async function refresh(){if(refreshPending||Date.now()-lastRefresh<30000)return;refreshPending=true;const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);try{const response=await fetch('/api/public',{cache:'no-store',signal:controller.signal});if(!response.ok)throw Error('No se pudo cargar el catálogo.');const next=await response.json(),changed=JSON.stringify(next)!==JSON.stringify(shared);shared=next;catalogError='';lastRefresh=Date.now();if(changed)render()}catch(e){catalogError='No pudimos cargar la información. Volvé a intentar en unos instantes.';render()}finally{refreshPending=false;clearTimeout(timeout);finishLoading()}}
const chosen={};let interest='';const root=document.getElementById('public-content');

const instagramDefaults=['https://www.instagram.com/reel/DVwYoQICcfc/','https://www.instagram.com/reel/DbBo_6_JV9s/','https://www.instagram.com/reel/DVZqVxWia2_/'];
function instagramUrl(value){
 try{const u=new URL(String(value||'').trim());if(u.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(u.hostname)||u.port||u.username||u.password)return '';const match=u.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]{1,100})\/?$/);return match?'https://www.instagram.com/'+match[1]+'/'+match[2]+'/':''}catch{return ''}
}

let instagramScriptPromise=null;
function instagramMarkup(config){
 const urls=[1,2,3].map(i=>instagramUrl(config['instagramUrl'+i]??instagramDefaults[i-1])).filter(Boolean);
 if(!urls.length)return '';
 return '<section class="instagram-section" aria-labelledby="instagram-title"><div class="instagram-heading"><span class="eyebrow">'+esc(config.instagramKicker??'CASPLAST EN INSTAGRAM')+'</span><h2 id="instagram-title">'+esc(config.instagramTitle??'Nuestros trabajos en video.')+'</h2><p>'+esc(config.instagramText??'Conocé nuestros pisos en acción.')+'</p></div><div class="instagram-grid">'+urls.map((url,i)=>'<article class="instagram-card" aria-label="Publicación de Instagram '+(i+1)+'"><blockquote class="instagram-media" data-instgrm-permalink="'+esc(url)+'" data-instgrm-version="14"><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Ver publicación '+(i+1)+' en Instagram</a></blockquote><a class="instagram-link" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Abrir en Instagram ↗</a></article>').join('')+'</div><p class="instagram-notice" role="status">Contenido alojado en Instagram. Si una publicación no se muestra, usá el enlace para abrirla.</p></section>';
}
function loadInstagram(){
 if(!root.querySelector('.instagram-media'))return;
 if(window.instgrm?.Embeds?.process){window.instgrm.Embeds.process();return}
 if(!instagramScriptPromise)instagramScriptPromise=new Promise((resolve,reject)=>{
 const script=document.createElement('script');script.src='https://www.instagram.com/embed.js';script.async=true;script.dataset.casplastInstagram='1';
 script.onload=()=>resolve();script.onerror=()=>{script.remove();instagramScriptPromise=null;reject(Error('Instagram no disponible'))};document.body.append(script);
 });
 instagramScriptPromise.then(()=>{if(root.querySelector('.instagram-media'))window.instgrm?.Embeds?.process()}).catch(()=>{const notice=root.querySelector('.instagram-notice');if(notice)notice.textContent='No se pudo cargar Instagram. Podés ver los videos con los enlaces de cada publicación.'});
}

let disposeCarousel=()=>{};
const bannerVideo=v=>/^banner-media\/[a-zA-Z0-9-]+\.(mp4|webm)$/.test(v||'');
function carouselMarkup(config){
 const valid=v=>v==='casplast-banner.png'||/^tile-images\/[a-zA-Z0-9-]+\.jpg$/.test(v||'')||bannerVideo(v);
 const list=(Array.isArray(config.bannerImages)?config.bannerImages:[config.bannerImage]).filter(valid).slice(0,10),items=list.length?list:['casplast-banner.png'];
 return '<figure class="hero-design" aria-label="Banner de CASPLAST"><div class="banner-slides">'+items.map((url,i)=>bannerVideo(url)?'<video data-slide="'+i+'" '+(i?'hidden':'')+' src="'+esc(url)+'" muted playsinline loop preload="metadata" aria-label="'+esc(config.bannerAlt||'Video de CASPLAST')+'"></video>':'<img data-slide="'+i+'" '+(i?'hidden':'')+' src="'+esc(url)+'" alt="'+esc(config.bannerAlt||'Piso CASPLAST')+'">').join('')+'</div>'+(String(config.bannerCaption??'DISEÑÁ DESDE EL PISO.').trim()?'<div class="banner-bottom"><figcaption>'+esc(config.bannerCaption??'DISEÑÁ DESDE EL PISO.')+'</figcaption></div>':'')+'</figure>';
}
function startCarousel(){
 const box=root.querySelector('.hero-design'),slides=box?.querySelectorAll('[data-slide]');if(!slides?.length)return;
 let index=0,timer=null;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const stop=()=>{clearInterval(timer);timer=null;slides.forEach(s=>{if(s.tagName==='VIDEO')s.pause()})};
 const play=()=>{const s=slides[index];if(s.tagName==='VIDEO'&&!reduced.matches&&!document.hidden){s.muted=true;s.play().catch(()=>{})}};
 const show=n=>{stop();index=(n+slides.length)%slides.length;slides.forEach((s,i)=>{s.hidden=i!==index;if(i===index&&s.tagName==='VIDEO')s.currentTime=0});schedule()};
 function schedule(){stop();if(!reduced.matches&&!document.hidden){play();if(slides.length>1)timer=setInterval(()=>show(index+1),5000)}}
 document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',schedule);
 disposeCarousel=()=>{stop();document.removeEventListener('visibilitychange',schedule);reduced.removeEventListener('change',schedule)};schedule();
}

/* Presentación pública: solo contenido visual; no escribe datos del administrador. */
function attributesMarkup(config){
 return '<section class="attributes" aria-label="Atributos de CASPLAST"><ul>'+[1,2,3,4].map(i=>config['attribute'+i]??window.casplastContentDefaults['attribute'+i]).map((text,i)=>'<li><span class="attribute-mark" aria-hidden="true">'+['↧','▥','✓','↗'][i]+'</span><strong>'+esc(text)+'</strong></li>').join('')+'</ul></section>';
}
function projectsMarkup(config){
 const photos=[...new Set((Array.isArray(config.projectImages)?config.projectImages:(Array.isArray(config.bannerImages)?config.bannerImages:[config.bannerImage])).filter(v=>/^tile-images\/[a-zA-Z0-9-]+\.jpg$/.test(v||'')))].slice(0,3);
 if(!photos.length)return '';
 return '<section class="projects-section" aria-labelledby="projects-title"><div class="section-heading"><div><span class="eyebrow">'+esc(config.bannerCaption||'TRABAJOS REALIZADOS')+'</span><h2 id="projects-title">Proyectos reales</h2></div><a href="#catalogo" class="text-link">Explorar catálogo <span aria-hidden="true">↗</span></a></div><div class="project-grid">'+photos.map((url,i)=>'<figure class="project-card"><a class="project-photo" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer" aria-label="Ver foto de proyecto '+(i+1)+' en tamaño completo"><img src="'+esc(url)+'" alt="Proyecto CASPLAST · '+(i+1)+'" loading="lazy" decoding="async" width="800" height="1000"></a><figcaption><span class="project-number" aria-hidden="true">0'+(i+1)+'</span><a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Ver foto <span aria-hidden="true">↗</span></a></figcaption></figure>').join('')+'</div><div class="section-actions"><a class="button outline" href="#contacto">Solicitar cotización <span aria-hidden="true">↗</span></a></div></section>';
}
function actionMarkup(){
 return '<section class="action-section" aria-label="Catálogo y cotización"><div><span class="eyebrow">CASPLAST</span><h2>Hablemos de tu proyecto.</h2></div><div class="section-actions"><a class="button" href="#catalogo">Explorar catálogo <span aria-hidden="true">↗</span></a><a class="button outline" href="#contacto">Solicitar cotización <span aria-hidden="true">↗</span></a></div></section>';
}
let entranceObserver;
function polishPublicView(){
 entranceObserver?.disconnect();
 root.querySelectorAll('.product img').forEach((img,i)=>{img.loading=i<4?'eager':'lazy';img.decoding='async'});
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
  entranceObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('subtle-entry');entranceObserver.unobserve(entry.target)}}),{threshold:.08});
  root.querySelectorAll('.intro,.section-heading,.project-card,.instagram-heading,.instagram-card,.product,.contact-guide,.action-section').forEach(el=>entranceObserver.observe(el));
 }
}


function usesMarkup(config){
 const v=key=>esc(config[key]??window.casplastContentDefaults[key]);
 return '<section class="title"><span class="eyebrow">'+v('usesKicker')+'</span><h1>'+v('usesTitle')+'</h1><p>'+v('usesIntro')+'</p></section><section class="uses-guide"><div class="uses-grid">'+[1,2,3,4,5,6].map(n=>'<article class="install-card"><span class="install-number" aria-hidden="true">0'+n+'</span><h2>'+v('uses'+n+'Title')+'</h2><p>'+v('uses'+n+'Text')+'</p></article>').join('')+'</div><aside class="install-help"><h2>'+v('usesNoteTitle')+'</h2><p>'+v('usesNote')+'</p><div class="section-actions"><a class="button" href="#contacto">'+v('usesContact')+' ↗</a><a class="button outline" href="#catalogo">'+v('usesCatalog')+' ↗</a><a class="text-link" href="#instalacion">'+v('usesInstallation')+' ↗</a></div></aside></section>';
}
function installationMarkup(config){
 const v=key=>esc(config[key]??window.casplastContentDefaults[key]);
 const diagram=left=>'<svg viewBox="0 0 220 150" aria-hidden="true" focusable="false">'+[0,1,2,3].map(i=>{const x=35+(i%2)*76,y=12+Math.floor(i/2)*66;return '<rect x="'+x+'" y="'+y+'" width="60" height="50" rx="3" fill="#eef3f7" stroke="#b8c8d5"/><path d="M'+(left?x:x+60)+' '+(y+8)+'v34 M'+(x+8)+' '+(y+50)+'h44" fill="none" stroke="#1a597e" stroke-width="5"/>'}).join('')+'</svg>';
 const card=(key,n)=>'<article class="install-card"><span class="install-number">'+n+'</span><h2>'+v('install'+key+'Title')+'</h2><p>'+v('install'+key+'Text')+'</p></article>';
 return '<section class="title"><span class="eyebrow">INSTALACIÓN</span><h1>'+v('installTitle')+'</h1><p>'+v('installIntro')+'</p></section><section class="installation-guide" aria-label="Guía de instalación"><div class="install-grid">'+card('Base','01')+card('Drain','02')+'</div><article class="install-pattern"><div><span class="install-number">03</span><h2>'+v('installPatternTitle')+'</h2><p>'+v('installPatternText')+'</p></div><div><div class="install-diagrams"><figure>'+diagram(false)+'<figcaption>'+v('installRightLabel')+'</figcaption></figure><figure>'+diagram(true)+'<figcaption>'+v('installLeftLabel')+'</figcaption></figure></div><p class="install-caption">'+v('installDiagramCaption')+'</p></div></article><div class="install-grid">'+card('Rows','04')+card('Cut','05')+card('Surplus','06')+'</div><aside class="install-help"><p>'+v('installNote')+'</p><div class="section-actions"><a class="button" href="#contacto">Consultar instalación ↗</a><a class="button outline" href="#catalogo">Explorar catálogo ↗</a></div></aside></section>';
}

function catalogPrice(m){
 const rate=m.pricePerM2;
 if(typeof rate!=='number'||!Number.isFinite(rate))return '<p class="catalog-price">Consultar precio por m²</p>';
 const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
 return '<div class="catalog-price"><small>Precio por m²</small><strong>'+esc(money(rate))+'</strong>'+(Number(m.uvExtraPerM2)>0?'<small>Adicional UV: '+esc(money(m.uvExtraPerM2))+' / m²</small>':'')+'</div>';
}
function updateWhatsApp(config){
 const phone=String(config.whatsapp||'').replace(/\D/g,'');let button=document.getElementById('floating-whatsapp');
 if(!phone){button?.remove();return}
 if(!button){button=document.createElement('a');button.id='floating-whatsapp';button.className='floating-whatsapp';button.target='_blank';button.rel='noopener noreferrer';button.setAttribute('aria-label','Chatear con CASPLAST por WhatsApp');button.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M27 15.5a11.5 11.5 0 0 1-17 10L4 27l1.5-5.7A11.5 11.5 0 1 1 27 15.5Z"/><path d="M11 9c-3 2 0 7 3 10s7 4 9 1l-4-3-2 2c-3-1-5-3-6-6l2-1-2-3Z"/></svg><span>Hablemos por WhatsApp</span>';document.body.append(button)}
 button.href='https://wa.me/'+phone+'?text='+encodeURIComponent('Hola CASPLAST, quisiera consultar '+(interest?'por el modelo '+interest:'por sus baldosas'));
}
function render(){disposeCarousel();const db=read(),config=db.publicSettings||{},route=['nosotros','catalogo','usos','instalacion','contacto'].includes(location.hash.slice(1))?location.hash.slice(1):'nosotros';const defaults={backgroundColor:'#f3f5f2',menuColor:'#101510',buttonColor:'#237a36',bannerColor:'#182019'};
updateWhatsApp(config);
const contrast=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722>.179?'#101510':'#ffffff'};
for(const [key,value] of Object.entries(defaults)){const color=/^#[0-9a-f]{6}$/i.test(config[key]||'')?config[key]:value;document.body.style.setProperty('--'+key,color);document.body.style.setProperty('--'+key+'-ink',contrast(color))}
document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+route)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
if(route==='nosotros')root.innerHTML=`<section class="hero"><div class="hero-copy"><span class="eyebrow">CASPLAST / BALDOSAS ENCASTRABLES</span><h1>${esc(config.bannerTitle||'Tu espacio.\nTu diseño.')}</h1><p>${esc(config.bannerText||'Dale identidad a cada metro cuadrado. Elegí tu modelo, combiná colores y creá un piso a tu medida.')}</p><div class="hero-actions"><a class="button" href="#catalogo">${esc(config.bannerButton||'Explorar catálogo')} ↗</a><a class="button hero-secondary" href="#contacto">Solicitar cotización <span aria-hidden="true">↗</span></a></div><div class="hero-note" style="overflow-wrap:anywhere" ${String(config.bannerNote??'MODELOS + COLORES + POSIBILIDADES').trim()?'':'hidden'}>${esc(config.bannerNote??'MODELOS + COLORES + POSIBILIDADES')}</div></div>${carouselMarkup(config)}</section>${attributesMarkup(config)}<section class="intro"><span class="eyebrow">01 / QUIÉNES SOMOS</span><h2>Pisos con<br>identidad propia.</h2><p class="preserve">${esc(config.about||'En CASPLAST fabricamos baldosas plásticas encastrables. Combinamos modelos y colores para dar forma a espacios con identidad propia.')}</p></section>${projectsMarkup(config)}${instagramMarkup(config)}${actionMarkup()}`;
if(route==='nosotros'){startCarousel();loadInstagram()};
if(route==='catalogo')root.innerHTML=`<section class="title"><span class="eyebrow">NUESTROS MODELOS</span><h1>Encontrá tu piso.</h1><p>Explorá las medidas y los colores disponibles. Seleccioná un color para ver su foto.</p></section><section class="products">${(db.models||[]).filter(m=>m.active).map(m=>{const colors=(m.colors||[]).map(id=>db.colors.find(c=>c.id===id)).filter(c=>c&&c.active!==false),selected=colors.find(c=>c.id===chosen[m.id])||colors[0],url=m.catalogPhotos?.[selected?.id]||m.tilePhotos?.[selected?.id],valid=typeof url==='string'&&/^tile-images\/[a-zA-Z0-9-]+\.jpg$/.test(url);return `<article class="product"><div class="image">${valid?`<img src="${esc(url)}" alt="${esc(m.name)} · ${esc(selected.name)}">`:`<div class="sample" style="background:${/^#[0-9a-f]{6}$/i.test(selected?.hex)?selected.hex:'#ccc'}"></div><small>Referencia de color</small>`}</div><div class="info"><span class="eyebrow">${esc(m.width)} × ${esc(m.length)} cm</span><h2>${esc(m.name)}</h2>${catalogPrice(m)}<p>Colores disponibles</p><div class="colors">${colors.map(c=>`<button data-model="${esc(m.id)}" data-color="${esc(c.id)}" aria-pressed="${c.id===selected?.id}"><i style="background:${/^#[0-9a-f]{6}$/i.test(c.hex)?c.hex:'#ccc'}"></i>${esc(c.name)}</button>`).join('')||'<span>Consultá las opciones disponibles.</span>'}</div><a href="#contacto" class="button outline" data-interest="${esc(m.name)}">Consultar este modelo ↗</a></div></article>`}).join('')||`<p class="empty">${esc(catalogError||'Próximamente encontrarás nuestros modelos disponibles.')}</p>`}</section>`;
const usesLink=document.querySelector('nav a[href="#usos"]');if(usesLink)usesLink.textContent=config.usesNav??window.casplastContentDefaults.usesNav;
if(route==='usos')root.innerHTML=usesMarkup(config);
if(route==='instalacion')root.innerHTML=installationMarkup(config);
if(route==='catalogo')root.insertAdjacentHTML('beforeend',actionMarkup());
if(route==='contacto'){const phone=String(config.whatsapp||'').replace(/\D/g,''),mail=String(config.email||'').trim();root.innerHTML=`<section class="title"><span class="eyebrow">CONTÁCTENOS</span><h1>Hablemos de tu proyecto.</h1><p>Contanos qué espacio querés transformar y qué modelo te interesa.</p></section><section class="contact"><div><h2>CASPLAST</h2>${phone?`<p>WhatsApp<br><a href="https://wa.me/${phone}?text=${encodeURIComponent('Hola CASPLAST, quisiera consultar '+(interest?'por el modelo '+interest:'por sus baldosas'))}" target="_blank" rel="noopener">${esc(config.whatsapp)} ↗</a></p>`:''}${mail?`<p>Email<br><a href="mailto:${esc(encodeURIComponent(mail))}">${esc(mail)}</a></p>`:''}${config.address?`<p>Dirección<br>${esc(config.address)}</p>`:''}${config.hours?`<p>Horario de atención<br>${esc(config.hours)}</p>`:''}${!phone&&!mail&&!config.address?'<p>Próximamente publicaremos nuestros canales de contacto.</p>':''}</div><div class="contact-guide"><h2>Prepará tu consulta</h2><p>Para ayudarte, necesitamos las medidas del espacio, el modelo elegido y los colores que te gustan.</p>${interest?`<p>Modelo de interés: <strong>${esc(interest)}</strong></p>`:''}<a class="button outline" href="#catalogo">Explorar catálogo ↗</a></div></section>`}polishPublicView()}
document.addEventListener('click',e=>{const c=e.target.closest('[data-color]');if(c){chosen[c.dataset.model]=c.dataset.color;render()}const a=e.target.closest('[data-interest]');if(a)interest=a.dataset.interest});window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});window.addEventListener('focus',refresh);render();refresh();
})();
