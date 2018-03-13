#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const debug = require('debug')('cli');
const child_process = require('child_process');

const createUtil = require('../scripts/create.js');
const buildUtil = require('../scripts/build.js');

debug('init');

program.version('1.0.0')
  .command('create')
  .description('create default docs with openapi3.0 specs')
  .action(function(env, options) {
    debug('create');
    //debug('env',env)
    //debug('options',options)
    createUtil.run();
  });

program.command('build')
  .description('build docs')
  .action(function(env, options) {
    debug('build');
    buildUtil.run();
  });

program.command('preview <file>')
  .description('preview docs with openapi3.0 specs')
  .action(function(file, options) {
    debug('preview')
    debug('file',file)
    let preview = child_process.spawn(path.join(__dirname,'../scripts/preview.js'),[file]);
    preview.stdout.on('data',data=>{
      console.log(data.toString());
    })
    preview.stderr.on('data',data=>{
      console.error(data.toString());
    })
    preview.on('close',code=>{
      debug('close',code);
    });
  });

program.command('mock')
  .description('run mock server')
  .action(function(env, options) {
    debug('mock');
  });

program.parse(process.argv);

process.on('exit', function(err) {
  debug('exit',err);
})

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
