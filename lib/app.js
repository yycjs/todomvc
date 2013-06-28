var express = require('express');
var app = express();
var io = require('socket.io').listen(4000);
var todos = [
  { id: 0, text: 'Drink beer', complete: false },
  { id: 1, text: 'Write JavaScript that works', complete: false },
  { id: 2, text: 'Write JavaScript', complete: true }
];

io.sockets.on('connection', function (socket) {
  socket.on('todo::findAll', function(callback) {
    callback(todos);
  });

  socket.on('todo::create', function(data) {
    data.id = todos.length + 1;
    todos.push(data);
    socket.broadcast.emit('todo created', data);
  });

  socket.on('todo::update', function(data) {
    todos[data.id] = data;
    socket.broadcast.emit('todo updated', data);
  });
});

app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/../public/'));

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
