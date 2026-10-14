'use strict';
const contentDefaults = require('./site-content');
const http = require('node:http');
const fs = require('node:fs');
const fsp = fs.promises;
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const scrypt = promisify(crypto.scrypt);

const PUBLIC_FILES = ['site-content.js','index.html','public.js','public.css','casplast-logo.png','casplast-banner.png','branding.css','favicon.ico','favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png','icon-maskable-512.png','site.webmanifest','admin.webmanifest'];
const ADMIN_FILES = ['app.js','grid.js','selection.js','view.js','rulers.js','quickfill.js','final-ui.js','quote-summary.js','pricing-m2.js','uv.js','surplus.js','budget-pdf.js','pdf-layout.js','admin-menu.js','admin-delete.js','admin-budgets.js','login.js','admin-entry.js','realistic.js','public-settings.js','styles.css','responsive.css','cotizador.css','budgets.css','admin-sidebar.css','surplus.css'];
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
const EMPTY=()=>({models:[],colors:[],budgets:[],sales:[],cashLedger:[],orders:[],waste:0,publicSettings:{}});
const imagePath = v => typeof v==='string' && /^tile-images\/[a-zA-Z0-9-]+\.jpg$/.test(v);
const videoPath=v=>typeof v==='string'&&/^banner-media\/[a-zA-Z0-9-]+\.(mp4|webm)$/.test(v);
const instagramDefaults=['https://www.instagram.com/reel/DVwYoQICcfc/','https://www.instagram.com/reel/DbBo_6_JV9s/','https://www.instagram.com/reel/DVZqVxWia2_/'];
function instagramUrl(value){
 try{const u=new URL(String(value||'').trim());if(u.protocol!=='https:'||!['instagram.com','www.instagram.com'].includes(u.hostname)||u.port||u.username||u.password)return '';const match=u.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]{1,100})\/?$/);return match?'https://www.instagram.com/'+match[1]+'/'+match[2]+'/':''}catch{return ''}
}

function validate(data){
  if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Datos inválidos');
  for(const key of ['models','colors','budgets','sales','cashLedger']){
    if(!Array.isArray(data[key]||[]))throw Error('Colección inválida: '+key);
    const ids=new Set();
    for(const item of data[key]||[]){
      if(!item||typeof item.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(item.id)||ids.has(item.id))throw Error('Identificador inválido o duplicado: '+key);
      ids.add(item.id);
    }
  }
  for(const c of data.colors||[])if(typeof c.name!=='string'||!/^#[0-9a-f]{6}$/i.test(c.hex))throw Error('Color inválido');
  for(const m of data.models||[]){
    if(typeof m.name!=='string'||!Number.isFinite(m.width)||!Number.isFinite(m.length)||m.width<5||m.length<5||m.width>3000||m.length>3000||!Array.isArray(m.colors))throw Error('Modelo o medidas inválidas (mínimo 5 cm)');
    if(m.colors.some(id=>!(data.colors||[]).some(c=>c.id===id)))throw Error('Color del modelo inexistente');
    for(const v of Object.values(m.tilePhotos||{}))if(!imagePath(v))throw Error('Foto inválida');
    for(const v of Object.values(m.catalogPhotos||{}))if(!imagePath(v))throw Error('Foto de catálogo inválida');
    for(const key of ['price','pricePerM2','uvExtraPerM2'])if(m[key]!=null&&(!Number.isFinite(m[key])||m[key]<0))throw Error('Precio inválido');
  }
  const c=data.publicSettings||{};
  for(const key of Object.keys(contentDefaults))if(c[key]!==undefined&&(typeof c[key]!=='string'||c[key].length>(key.startsWith('attribute')?500:1200)))throw Error('Texto de instalación o atributo inválido');
  for(const i of [1,2,3]){const raw=c['instagramUrl'+i];if(raw&&(typeof raw!=='string'||raw.length>500||!instagramUrl(raw)))throw Error('Enlace de Instagram inválido: '+i)}
  if(c.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))throw Error('Email inválido');
  if(c.backgroundImage&&!imagePath(c.backgroundImage))throw Error('Fondo inválido');
  if(c.bannerImages!==undefined&&(!Array.isArray(c.bannerImages)||c.bannerImages.length>10||c.bannerImages.some(v=>v!=='casplast-banner.png'&&!imagePath(v)&&!videoPath(v))))throw Error('Carrusel inválido: máximo 10 imágenes o videos');
  if(c.projectImages!==undefined&&(!Array.isArray(c.projectImages)||c.projectImages.length>3||c.projectImages.some(v=>!imagePath(v))))throw Error('Proyectos inválidos: máximo 3 fotos');
  for(const k of ['instagramKicker','instagramTitle','instagramText'])if(c[k]!==undefined&&(typeof c[k]!=='string'||c[k].length>500))throw Error('Texto de videos inválido');
  if(c.bannerImage&&!imagePath(c.bannerImage))throw Error('Banner inválido');
  for(const key of ['backgroundColor','menuColor','buttonColor','bannerColor'])if(c[key]&&!/^#[0-9a-f]{6}$/i.test(c[key]))throw Error('Color de diseño inválido');
  function walk(v,depth=0){
    if(depth>20)throw Error('Datos demasiado anidados');
    if(typeof v==='string'&&v.length>20000)throw Error('Texto demasiado largo');
    if(v&&typeof v==='object')for(const [k,x]of Object.entries(v)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Clave inválida');walk(x,depth+1)}
  }walk(data);
  return {...EMPTY(),...data};
}
function publicData(db){
  const colors=(db.colors||[]).filter(c=>c.active!==false).map(c=>({id:c.id,name:c.name,hex:c.hex,active:true}));
  return {models:(db.models||[]).filter(m=>m.active).map(m=>({id:m.id,name:m.name,width:m.width,length:m.length,active:true,pricePerM2:(()=>{const rate=Number(m.pricePerM2??(m.price/(m.width*m.length/10000)));return Number.isFinite(rate)&&rate>=0?rate:null})(),uvExtraPerM2:Number(m.uvExtraPerM2||0),colors:m.colors.filter(id=>colors.some(c=>c.id===id)),tilePhotos:m.tilePhotos||{},catalogPhotos:m.catalogPhotos||{}})),colors,
    publicSettings:{...Object.fromEntries(Object.entries(contentDefaults).map(([key,value])=>[key,String(db.publicSettings?.[key]??value)])),projectImages:Array.isArray(db.publicSettings?.projectImages)?db.publicSettings.projectImages:undefined,instagramKicker:String(db.publicSettings?.instagramKicker??'CASPLAST EN INSTAGRAM'),instagramTitle:String(db.publicSettings?.instagramTitle??'Nuestros trabajos en video.'),instagramText:String(db.publicSettings?.instagramText??'Conocé nuestros pisos en acción.'),bannerNote:String(db.publicSettings?.bannerNote??'MODELOS + COLORES + POSIBILIDADES'),bannerCaption:String(db.publicSettings?.bannerCaption??'DISEÑÁ DESDE EL PISO.'),bannerImages:Array.isArray(db.publicSettings?.bannerImages)?db.publicSettings.bannerImages:undefined,...Object.fromEntries(['about','whatsapp','email','address','hours','backgroundColor','menuColor','buttonColor','bannerColor','bannerTitle','bannerText','bannerButton','bannerAlt','bannerImage','instagramUrl1','instagramUrl2','instagramUrl3'].map(k=>[k,String(db.publicSettings?.[k]??(/^instagramUrl[123]$/.test(k)?instagramDefaults[Number(k.slice(-1))-1]:''))]))}};
}
async function createServer(options={}){
  const root=options.root||__dirname, dataDir=path.resolve(options.dataDir||process.env.DATA_DIR||path.join(root,'data'));
  const email=options.email||process.env.ADMIN_EMAIL,password=options.password||process.env.ADMIN_PASSWORD;
  if(!email||!password||password.length<16)throw Error('Configurá ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 16 caracteres) en .env o en el hosting.');
  const secure=options.secure??(process.env.NODE_ENV==='production'),origin=options.origin||process.env.APP_ORIGIN;
  if(secure&&(!origin||!origin.startsWith('https://')))throw Error('Producción requiere APP_ORIGIN=https://tu-dominio.');
  await fsp.mkdir(path.join(dataDir,'tile-images'),{recursive:true});
  await fsp.mkdir(path.join(dataDir,'banner-media'),{recursive:true});
  const dbFile=path.join(dataDir,'database.json');
  let state={revision:0,data:EMPTY()};
  try{state=JSON.parse(await fsp.readFile(dbFile,'utf8'));validate(state.data)}catch(e){if(e.code!=='ENOENT')throw e}
  const salt=crypto.randomBytes(16),hash=await scrypt(password,salt,64),sessions=new Map(),attempts=new Map();let transaction=Promise.resolve();
  const json=(res,status,data,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data))};
  const session=req=>{const token=/(?:^|;\s*)casplast_session=([a-f0-9]+)/.exec(req.headers.cookie||'')?.[1],expires=sessions.get(token);return expires>Date.now()?token:null};
  const cookie=(token,maxAge)=>'casplast_session='+token+'; HttpOnly; SameSite=Strict; Path=/; Max-Age='+maxAge+(secure?'; Secure':'');
  async function body(req,max=16*1024*1024){const chunks=[];let length=0;for await(const chunk of req){length+=chunk.length;if(length>max){const e=Error('Archivo demasiado grande');e.status=413;throw e}chunks.push(chunk)}return Buffer.concat(chunks)}
  async function file(res,name){try{const bytes=await fsp.readFile(name);res.writeHead(200,{'Content-Type':TYPES[path.extname(name)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(bytes)}catch{json(res,404,{error:'No encontrado'})}}
  const server=http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline' https://www.instagram.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://www.instagram.com; frame-src https://www.instagram.com; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
    try{
      const url=new URL(req.url,'http://local'),pathname=decodeURIComponent(url.pathname);
      if(['POST','PUT','DELETE'].includes(req.method)){
        const expected=origin||'http://'+req.headers.host;
        if(req.headers.origin!==expected||req.headers['sec-fetch-site']==='cross-site')return json(res,403,{error:'Origen no autorizado'});
      }
      if(req.method==='GET'&&pathname==='/health')return json(res,200,{ok:true});
      if(req.method==='POST'&&pathname==='/api/login'){
        const key=req.socket.remoteAddress,now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);
        const attempt=attempts.get(key)||{count:0,until:now+15*60*1000};
        if(attempt.count>=10)return json(res,429,{error:'Demasiados intentos. Esperá 15 minutos.'});
        attempt.count++;attempts.set(key,attempt);
        const credentials=JSON.parse((await body(req,8192)).toString());
        if(typeof credentials.password!=='string'||credentials.password.length>1024)return json(res,401,{error:'Email o contraseña incorrectos'});
        const candidate=await scrypt(credentials.password,salt,64);
        if(!crypto.timingSafeEqual(hash,candidate)||credentials.email!==email)return json(res,401,{error:'Email o contraseña incorrectos'});
        attempts.delete(key);for(const [k,v]of sessions)if(v<now)sessions.delete(k);const token=crypto.randomBytes(32).toString('hex');sessions.set(token,now+8*3600000);
        return json(res,200,{ok:true},{'Set-Cookie':cookie(token,8*3600)});
      }
      if(req.method==='POST'&&pathname==='/api/logout'){sessions.delete(session(req));return json(res,200,{ok:true},{'Set-Cookie':cookie('',0)})}
      if(req.method==='GET'&&pathname==='/api/public')return json(res,200,publicData(state.data));
      if(pathname.startsWith('/api/')){
        if(!session(req))return json(res,401,{error:'Ingresá al administrador'});
        if(req.method==='GET'&&pathname==='/api/admin/data')return json(res,200,state);
        if(req.method==='PUT'&&pathname==='/api/admin/data'){
          const payload=JSON.parse((await body(req)).toString()),data=validate(payload.data);
          const task=transaction.then(async()=>{
            if(payload.revision!==state.revision)return json(res,409,{error:'Otra sesión cambió los datos. Guardá una copia de tus cambios y recargá.'});
            const next={revision:state.revision+1,data};
            try{await fsp.copyFile(dbFile,dbFile+'.previous')}catch(e){if(e.code!=='ENOENT')throw e}
            const tmp=dbFile+'.tmp';await fsp.writeFile(tmp,JSON.stringify(next));await fsp.rename(tmp,dbFile);state=next;json(res,200,{revision:state.revision});
          });transaction=task.catch(()=>{});await task;return;
        }
        if(req.method==='POST'&&pathname==='/api/banner-video'){
          const bytes=await body(req,30*1024*1024),mime=(req.headers['content-type']||'').split(';')[0];
          const mp4=mime==='video/mp4'&&bytes.length>=12&&bytes.toString('ascii',4,8)==='ftyp';
          const webm=mime==='video/webm'&&bytes.length>=4&&bytes.subarray(0,4).equals(Buffer.from([0x1a,0x45,0xdf,0xa3]));
          if(!mp4&&!webm)return json(res,400,{error:'Video inválido: usá MP4 o WebM'});
          const name=crypto.randomUUID()+(mp4?'.mp4':'.webm');await fsp.writeFile(path.join(dataDir,'banner-media',name),bytes);return json(res,200,{url:'banner-media/'+name});
        }
        if(req.method==='POST'&&pathname==='/api/tile-image'){
          const bytes=await body(req,2*1024*1024);
          if(bytes[0]!==255||bytes[1]!==216||bytes[2]!==255)return json(res,400,{error:'JPEG inválido'});
          const name=crypto.randomUUID()+'.jpg';await fsp.writeFile(path.join(dataDir,'tile-images',name),bytes);return json(res,200,{url:'tile-images/'+name});
        }
        return json(res,404,{error:'No encontrado'});
      }
      if(req.method!=='GET')return json(res,405,{error:'Método no permitido'});
      if(pathname==='/')return file(res,path.join(root,'index.html'));
      const name=pathname.slice(1);
      if(videoPath(name)){
        const location=path.join(dataDir,name);let stat;try{stat=await fsp.stat(location)}catch{return json(res,404,{error:'No encontrado'})}
        const headers={'Content-Type':name.endsWith('.mp4')?'video/mp4':'video/webm','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
        let start=0,end=stat.size-1,status=200;
        if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
          if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':'bytes */'+stat.size});return res.end()}
          if(!match[1])start=Math.max(0,stat.size-Number(match[2]));else{start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]))}
          if(start>end||start>=stat.size){res.writeHead(416,{'Content-Range':'bytes */'+stat.size});return res.end()}
          status=206;headers['Content-Range']='bytes '+start+'-'+end+'/'+stat.size;
        }
        headers['Content-Length']=end-start+1;res.writeHead(status,headers);const stream=fs.createReadStream(location,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());return stream.pipe(res);
      }
      if(imagePath(name)){
        const internal=path.join(dataDir,name);
        try{await fsp.access(internal);return file(res,internal)}catch{
          // Compatibilidad con fotos de la primera versión local.
          return file(res,path.join(root,name));
        }
      }
      if(PUBLIC_FILES.includes(name)||['admin.html','admin-bootstrap.js'].includes(name))return file(res,path.join(root,name));
      if(ADMIN_FILES.includes(name)){if(!session(req))return json(res,401,{error:'Ingresá al administrador'});return file(res,path.join(root,name))}
      return json(res,404,{error:'No encontrado'});
    }catch(e){if(!res.headersSent)json(res,e.status||400,{error:e.code?'No se pudo completar la operación':e.message});else res.end()}
  });
  server.requestTimeout=30000;server.headersTimeout=15000;
  return server;
}
if(require.main===module){
  try{process.loadEnvFile(path.join(__dirname,'.env'))}catch(e){if(e.code!=='ENOENT')throw e}
  createServer().then(server=>server.listen(Number(process.env.PORT)||4173,process.env.HOST||'127.0.0.1',()=>console.log('CASPLAST listo en puerto '+(process.env.PORT||4173)))).catch(e=>{console.error(e.message);process.exitCode=1});
}
module.exports={createServer,validate,publicData,EMPTY};
