'use strict';
const app = require('express')();
const http = require('http').Server(app);
const sio = require('socket.io')(http);
const master_server = require("socket.io-client")('http://localhost:8100'); // This is a client connecting to the SERVER 2

const rxjs = require('rxjs');

// SERVER 2

// CONECTAR CON SERVER
master_server.on("connect",function(){
console.log("MASTER SERVER Connected!");
});


// LOCAL SERVER
sio.on('connection', onConnect);

// CALLBACK LOCAL SERVER
  function onConnect(socket){
    console.log('SERVER CLIENT CONNECTED');

// RECIBIR MENSAJES
    socket.on('message', function(msg){
      // EMITIR MENSAJE AL SERVIDOR
    master_server.emit("message", msg);
  });

  // VER SI SE DESCONECTA
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

}
retorno('msg').subscribe(function(msj){
  console.log('asf' + msj);
});
enviar('msh');

/**
 * Envia un mensaje para analizar
 * @param {string} msg
 * @return {string}
 */
function enviar(msg) {
  master_server.emit("message", msg);
}

/**
 * Recibe la informacion analizada
 * @param {string} msg
 * @return {string}
 */
function retorno(msg) {
  const observable = new rxjs.Observable((observer) => {
      // RECIBIR MENSAJES DEL SERVIDOR
      master_server.on('chatmessage', function(msg){
        observer.next(msg);
      });
  });

  return observable;
  };
console.log('test');
module.exports.retorno = retorno;
module.exports.enviar = enviar;
