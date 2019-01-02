// 'use strict';
//
// /**
//  * Adds commas to a number
//  * @param {number} number
//  * @param {string} locale
//  * @return {string}
//  */
//  function numeros(number, locale) {
//      return number.toLocaleString(locale);
//  };
//
//
// const app = require('express')();
// const http = require('http').Server(app);
// const sio = require('socket.io')(http);
//
// http.listen(3001, function(){
//   console.log('listening on *:3001');
//   console.log(sio);
// });
// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });
//
// sio.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('chat message', function(msg){
//     sio.emit('chat message', msg);
//   });
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });


// module.exports.sio = sio;
// module.exports.string = 'numero';

let apikeys = { apikey: 0 };
let secret = ['secret'];
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

let tokens = {};


// encriptar mensaje de regreso
function encrypt(data) {
  // buscar api secret en la lista de api secrets por el token
  const secret = tokens[data.token];
  if (secret !== undefined) {
    // encriptar por el apisecret
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data.msg), secret);
    // console.log('ciphertext', ciphertext.toString());
    return ciphertext.toString();
  } else {
    return null;
  }
}

var allClients = [];

// Server 1
var io = require("socket.io").listen(8100);
io.sockets.on("connection", function (socket) {
  allClients.push(socket);
  // console.log(allClients);
  console.log("Server Connected!");
  // console.log(socket);
  var address = socket.handshake;

  var user = {
    'time': address.time.toString().replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, ''),
    'connection': address.headers['user-agent'].replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '')
  };
  var SECRET = 'alfsj23ljdf9gj23alfsj23ljdf9gj23JSDLljfdljsd923F';
  var token = jwt.sign(user, SECRET, { expiresIn: 300 });
  socket.emit('getToken', token);
  // socket.broadcast.emit('getToken', token);

  socket.on("token_apikey", function (data) {
    // comprobar si el api key existe y cotejarlo con el token
    let apiSecret = secret[apikeys[data.apikey]]
    let token = apiSecret ? data.token : undefined;
    // si el token concuerda con el apisecret continuar
    if (token !== undefined) {
      //guardar el token cotejado con el apisecret
      tokens[token] = apiSecret;
    }
  });

  // recibir mensajes
  socket.on("message", function (data) {
    //-- procesar informacion
    let respuesta = undefined;
    procesar(data).then(function (res) {
      respuesta = res;
      //--
      // encriptar mensaje de respuesta
      const encrypts = encrypt(respuesta);
      // si el encriptado va bien sera diferente de null
      if (encrypts !== null) {
        // enviar mensaje de regreso
        socket.emit('receive_message', encrypts);
        // socket.broadcast.emit('receive_message', encrypts);
      }
    });
  });

    socket.on('disconnect', function(data){
        var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
    });
});


async function procesar(data) {
  data.msg = 'data :' + data.msg;
  return await data;
}
