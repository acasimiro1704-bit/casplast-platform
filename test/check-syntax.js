'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
for(const file of fs.readdirSync(path.join(__dirname,'..')).filter(f=>f.endsWith('.js')))execFileSync(process.execPath,['--check',file],{stdio:'inherit',cwd:path.join(__dirname,'..')});
console.log('Sintaxis JavaScript correcta.');
