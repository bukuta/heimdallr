#!/usr/bin/env node
const path = require('path');
const opn = require('opn');
const express = require('express');
const debug = require('debug')('preview');
const cwd = process.cwd();
const heimdallr = require(path.resolve(__dirname,'../index.js'));

const app = express();

let port = process.env.PORT||3000;
let argv = process.argv;
debug('port',port);

let specfile = argv[2];
if(!specfile){
  console.error('no spec file find');
  process.exit(-1);
}

let normalizefile = path.join('/',path.normalize(specfile));
let realspecfile = path.resolve(path.join(cwd,specfile));

let staticPath = heimdallr.absolutePath();
debug('staticPath',staticPath);

app.get(normalizefile,function(req,res){
  debug('sendFile',req.path);
  res.sendFile(realspecfile);
});
app.use(express.static(staticPath));
app.listen(port,function(){
  opn(`http://127.0.0.1:${port}?url=${normalizefile}`);
});
