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


// Server 1
var io = require("socket.io").listen(8100);
io.sockets.on("connection",function(socket){
    console.log("Server Connected!");

    socket.on("message",function(data){
    console.log(data);
        socket.emit('receive_message', data);
        socket.broadcast.emit('receive_message', data);
    });
});
