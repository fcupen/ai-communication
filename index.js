'use strict';
const master_server = require("socket.io-client")('http://localhost:8100'); // This is a client connecting to the SERVER 2
const rxjs = require('rxjs');

// SERVER

function conectar() {
  const observable = new rxjs.Observable((observer) => {
    master_server.on("connect", function () {
      // console.log("MASTER SERVER Connected!");
      const estado = 'Conectado!';
      observer.next(estado);
    });
  });

  return observable;
}

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
function retorno() {
  const observable = new rxjs.Observable((observer) => {
    // RECIBIR MENSAJES DEL SERVIDOR
    master_server.on('chatmessage', function (msg) {
      observer.next(msg);
    });
  });

  return observable;
};

module.exports.conectar = conectar;
module.exports.retorno = retorno;
module.exports.enviar = enviar;
