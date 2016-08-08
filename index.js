'use strict';

const watch = require('chokidar').watch;
const babel = require('babel-core');
const pathjs = require('path');
const jade = require('jade');
require('shelljs/global');
const presets = {
  presets: ['es2015']
};

rm('-rf','./temp/**');
mkdir('./build');
''.to('./build/site.js');
''.to('./build/external.js');
''.to('./build/external.css');

watch('./src/**/*[^spec].js')
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
    destinyFile = destinyFile.replace('src/', 'build/').replace(/.jade/, '.html');
    mkdir('-p', pathjs.dirname(destinyFile));
    jade.renderFile(path).to(destinyFile);
  })
  .on('change', (path) => {
    console.log('file added to watch ' + path);
    let destinyFile = path;
    destinyFile = destinyFile.replace('src/', 'build/').replace(/.jade/, '.html');
    jade.renderFile(path).to(destinyFile);
  })


watch('./temp/**/*.js')
  .on('add', (path) => {
    cat(path).toEnd('./build/site.js'); //append to the end of the file 
  })
  .on('change', () => {
    cat('./temp/**/*.js').to('./build/site.js'); //override whole file
  });

[
  "bower_components/angular/angular.min.js",
  "bower_components/aws-sdk/dist/aws-sdk.min.js",
  "bower_components/lodash/dist/lodash.min.js"
].forEach(file => cat(file).toEnd('./build/external.js'));

[
  'bower_components/bulma/css/bulma.css',
  'bower_components/font-awesome/css/font-awesome.min.css'
].forEach(file => cat(file).toEnd('./build/external.css'));

function addiffe(code) {
  return '\n(function(){\n' + code + '\n})();\n';
}

function transpileToEs5(code) {
  return addiffe(babel.transform(code, presets).code);
}

var server = require('node-http-server');

server.deploy({
  port: 8080,
  root: 'build/'
});
echo("started server on port 8080");
