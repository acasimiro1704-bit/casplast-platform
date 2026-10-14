'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'outputs','casplast-release-'+new Date().toISOString().replace(/[:.]/g,'-'));
if(fs.existsSync(out))throw Error('La carpeta de entrega ya existe; elegí una carpeta nueva para evitar archivos antiguos.');
fs.mkdirSync(out,{recursive:true});
// Lista cerrada: nunca empaquetar datos, secretos ni imágenes de clientes.
const source=fs.readFileSync(path.join(root,'server.js'),'utf8');
const files=['server.js','admin.html','admin-bootstrap.js'];
for(const key of ['PUBLIC_FILES','ADMIN_FILES']){const match=source.match(new RegExp('const '+key+' = (\\[[^;]+\\]);'));if(!match)throw Error('No se encontró '+key);files.push(...JSON.parse(match[1].replace(/'/g,'"')))}
files.push('package.json','README.md','Dockerfile','.dockerignore','.gitignore','.env.example','.github/workflows/ci.yml','test/check-syntax.js','test/server.test.js','scripts/package-release.js');
for(const file of new Set(files)){const target=path.join(out,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target)}
console.log('Versión preparada en '+out+' (sin datos ni contraseñas).');
