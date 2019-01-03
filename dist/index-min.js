"use strict";const master_server=require("socket.io-client")("http://localhost:8100"),rxjs=require("rxjs"),CryptoJS=require("crypto-js");let apis={};const minify=require("gulp-minify"),gulp=require("gulp");function desencrypt(e){const t=CryptoJS.AES.decrypt(e.toString(),apis.secret);return JSON.parse(t.toString(CryptoJS.enc.Utf8))}function conectar(e){return new rxjs.Observable(t=>{master_server.on("connect",function(){master_server.on("getToken",function(t){master_server.emit("token_apikey",{apikey:e.key,token:t}),sessionStorage.setItem("tokenID",t),apis=e}),t.next("Conectado!")})})}function enviar(e){const t=sessionStorage.getItem("tokenID");master_server.emit("message",{msg:e,token:t})}function retorno(){return new rxjs.Observable(e=>{master_server.on("receive_message",function(t){const r=desencrypt(t);e.next(r)})})}gulp.task("compress",function(){gulp.src(["./*.js","./*.mjs"]).pipe(minify()).pipe(gulp.dest("dist"))}),module.exports.conectar=conectar,module.exports.retorno=retorno,module.exports.enviar=enviar;