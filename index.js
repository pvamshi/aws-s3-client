'use strict';

const watch = require('chokidar').watch;
const babel = require('babel-core');
const pathjs = require('path');
const jade = require('jade');
require('shelljs/global');
const presets = {
  presets: ['es2015']
};

watch('./src/**/*.js')
  .on('add', (path) => {
    console.log('file added to watch ' + path);
    let code = cat(path);
    let es5Code = transpileToEs5(code);
    let destinyFile = './temp/' + path;
    mkdir('-p', pathjs.dirname(destinyFile));
    es5Code.to(destinyFile);
  })
  .on('change', (path) => {
    console.log('file changed ' + path);
    let code = cat(path);
    let es5Code = transpileToEs5(code);
    let destinyFile = './temp/' + path;
    es5Code.to(destinyFile);
  });

watch('./src/**/*.jade')
  .on('add', (path) => {
    console.log('file added to watch ' + path);
    let destinyFile = path;
    destinyFile = destinyFile.replace('src/', 'html/').replace(/.jade/, '.html');
    mkdir('-p', pathjs.dirname(destinyFile));
    jade.renderFile(path).to(destinyFile);
  })
  .on('change', (path) => {
    console.log('file added to watch ' + path);
    let destinyFile = path;
    destinyFile = destinyFile.replace('src/', 'html/').replace(/.jade/, '.html');
    jade.renderFile(path).to(destinyFile);
  })

mkdir('./build');
''.to('./build/site.js'); 

watch('./temp/**/*.js')
  .on('add', (path) => {
    cat(path).toEnd('./build/site.js'); //append to the end of the file 
  })
  .on('change', () => {
    cat('./temp/**/*.js').to('./build/site.js'); //override whole file
  });

function addiffe(code) {
  return '\n(function(){\n' + code + '\n})();\n';
}

function transpileToEs5(code) {
  return addiffe(babel.transform(code, presets).code);
}

var server = require('node-http-server');

server.deploy({
  port: 8080
});
echo("started server on port 8080");
