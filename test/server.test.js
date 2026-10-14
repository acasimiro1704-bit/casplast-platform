'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),os=require('node:os'),path=require('node:path');
const {createServer,EMPTY}=require('../server');
test('Ingreso, privacidad, publicación compartida, persistencia, revisiones y fotos',async t=>{
 const testRoot=path.join(__dirname,'..','work');await fs.mkdir(testRoot,{recursive:true});
 const dir=await fs.mkdtemp(path.join(testRoot,'casplast-test-'));
 let server;async function open(){server=await createServer({dataDir:dir,email:'test@example.com',password:'test-only-password-123',secure:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));return 'http://127.0.0.1:'+server.address().port}
 let base=await open(),cookie='';t.after(async()=>{await new Promise(r=>server.close(r));await fs.rm(dir,{recursive:true,force:true})});
 const request=(url,options={})=>fetch(base+url,{...options,headers:{Origin:base,Cookie:cookie,...options.headers}});
 assert.equal((await request('/health')).status,200);
 assert.equal((await request('/api/admin/data')).status,401);
 assert.equal((await request('/app.js')).status,401);
 for(const file of ['.env','server.js','package.json','data/database.json','test/server.test.js','outputs/casplast-demo/app.js'])assert.equal((await request('/'+file)).status,404);
 assert.equal((await request('/api/tile-image',{method:'POST',body:'bad'})).status,401);
 let response=await request('/api/login',{method:'POST',body:JSON.stringify({email:'test@example.com',password:'incorrect'})});assert.equal(response.status,401);
 response=await request('/api/login',{method:'POST',body:JSON.stringify({email:'test@example.com',password:'test-only-password-123'})});assert.equal(response.status,200);cookie=response.headers.get('set-cookie').split(';')[0];assert.match(response.headers.get('set-cookie'),/HttpOnly/);
 let snapshot=await(await request('/api/admin/data')).json();assert.equal(snapshot.revision,0);
 const data={...EMPTY(),models:[{id:'m1',name:'Modelo real',active:true,width:20,length:20,price:800.6,colors:['black']},{id:'hidden',name:'Oculto',active:false,width:20,length:20,colors:['black']}],colors:[{id:'black',name:'Negro',active:true,hex:'#111111'}],budgets:[{id:'b1',customer:{name:'Cliente privado'},total:200}],sales:[{id:'s1',budgetId:'b1',total:200}],publicSettings:{email:'public@example.com',about:'Historia',backgroundColor:'#abcdef'}};
 response=await request('/api/admin/data',{method:'PUT',body:JSON.stringify({revision:0,data})});assert.equal(response.status,200,await response.text());
 const publicCopy=await(await fetch(base+'/api/public')).json();assert.equal(publicCopy.models.length,1);assert.equal(publicCopy.publicSettings.email,'public@example.com');assert.equal(publicCopy.budgets,undefined);assert.equal(publicCopy.sales,undefined);assert.equal(publicCopy.models[0].price,undefined);assert(!JSON.stringify(publicCopy).includes('Cliente privado'));
 response=await request('/api/admin/data',{method:'PUT',body:JSON.stringify({revision:0,data})});assert.equal(response.status,409);
 response=await request('/api/admin/data',{method:'PUT',headers:{Origin:'https://evil.example'},body:JSON.stringify({revision:1,data})});assert.equal(response.status,403);
 response=await request('/api/admin/data',{method:'PUT',body:JSON.stringify({revision:1,data:{...data,models:[{...data.models[0],width:0}]}})});assert.equal(response.status,400);
 response=await request('/api/tile-image',{method:'POST',body:Buffer.from([255,216,255,224,0,0,255,217])});assert.equal(response.status,200);const image=(await response.json()).url;assert.match(image,/^tile-images\/[\w-]+\.jpg$/);assert.equal((await fetch(base+'/'+image)).status,200);
 assert.equal((await request('/api/tile-image',{method:'POST',body:'<script>bad</script>'})).status,400);
 await new Promise(r=>server.close(r));base=await open();assert.equal((await request('/api/admin/data')).status,401);assert.equal((await(await fetch(base+'/api/public')).json()).models[0].name,'Modelo real');
 response=await request('/api/login',{method:'POST',body:JSON.stringify({email:'test@example.com',password:'test-only-password-123'})});cookie=response.headers.get('set-cookie').split(';')[0];await request('/api/logout',{method:'POST'});assert.equal((await request('/api/admin/data')).status,401);
});
test('Producción no arranca sin credenciales ni origen HTTPS',async()=>{
 await assert.rejects(createServer({email:'test@example.com',password:'short',secure:false}));
 await assert.rejects(createServer({email:'test@example.com',password:'long-password-for-test',secure:true,origin:'http://example.com'}));
});
