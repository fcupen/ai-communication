var express = require('express');
//var server = express.createServer();
// express.createServer()  is deprecated.
const app = express();
const http = require('http').Server(app);

app.use('/static', express.static('./'));
// app.use(express.static(__dirname + 'assets'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3001, function(){
  console.log('listening on *:3001');
});
