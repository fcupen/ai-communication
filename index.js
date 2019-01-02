'use strict';
const master_server = require("socket.io-client")('http://localhost:8100'); // This is a client connecting to the SERVER 2
const rxjs = require('rxjs');
const CryptoJS = require('crypto-js');
let apis = {};

function desencrypt(data) {
  const bytes = CryptoJS.AES.decrypt(data.toString(), apis.secret);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}

// SERVER

function conectar(api) {
  const observable = new rxjs.Observable((observer) => {
    master_server.on("connect", function () {
      // console.log("MASTER SERVER Connected!");
      const estado = 'Conectado!';
      master_server.on('getToken', function (token) {
        // mandar a verificar token y apikey
        master_server.emit("token_apikey", { apikey: api.key, token: token });
        // guardar token en session storage
        sessionStorage.setItem('tokenID', token);
        // guardar apis en variable local
        apis = api;
      });

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
  const token = sessionStorage.getItem('tokenID');
  master_server.emit("message", { msg: msg, token: token });
}

/**
 * Recibe la informacion analizada
 * @param {string} msg
 * @return {string}
 */
function retorno() {
  const observable = new rxjs.Observable((observer) => {
    // RECIBIR MENSAJES DEL SERVIDOR
    master_server.on('receive_message', function (msg) {
      const data = desencrypt(msg);
      observer.next(data);
    });
  });

  return observable;
};

module.exports.conectar = conectar;
module.exports.retorno = retorno;
module.exports.enviar = enviar;
