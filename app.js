
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    config = require('config'),
    Sequelize = require('sequelize'),
    SocketIO = require('socket.io'),
    check = require('validator').check,
    sanitize = require('validator').sanitize,
    sprintf = require('sprintf').sprintf;

// connecttion
var sequelize = new Sequelize(config.mysql);

// models imports
var Board   = sequelize.import(__dirname + "/models/board"),
    Tag     = sequelize.import(__dirname + "/models/tag"),
    Message = sequelize.import(__dirname + "/models/message");

var app = express();

// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('index', { title: config.title });
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// express 3.x Socket.IO compatibility
var io = SocketIO.listen(server);
server.listen(config.port);

io.sockets.on('connection', function(socket) {
  // initStart
  socket.emit('initStart');
  Board.findAll({ where: { visible: true } }).success(function(boards) {
    boards.forEach(function(board) {
      socket.emit('createBoard', board);
      Tag.findAll({ where : { board_id : board.id, visible : true }}).success(function(tags) {
        tags.forEach(function(tag) {
          socket.emit('createTag', tag);
        });
      });
    });
    socket.emit('initEnd');
  })
  // initEnd

  // create board
  socket.on('createBoard', function(data) {
    var name = toText(data);
    Board.create({ name : name }).success(function(board) {
      broadcast(socket, 'createBoard', board);
    });
  });

  // delete board
  socket.on('deleteBoard', function(data) {
    Board.count({ where : { visible : true }}).success(function(count) {
      if (count == 1) {
        socket.emit('error', 'can not remove last one board');
        return;
      }
      var id = toInt(data);
      Board.find(id).success(function(board){
        board.visible = false;
        board.save().success(function() {
          broadcast(socket, 'deleteBoard', id);
        });
      });
    });
  });

  // rename board
  socket.on('renameBoard', function(data) {
    var id = toInt(data.id);
    var name = toText(data.name);
    if (name == "") {
      socket.emit('error', 'can not rename board to empty');
      return;
    }
    Board.find(id).success(function(board) {
      board.name = name;
      board.save().success(function() {
        broadcast(socket, 'renameBoard', board);
      });
    });
  });

  // create tag
  socket.on('createTag', function(data) {
    var board_id = toInt(data.board_id);
    var position_x = toInt(data.position_x);
    var position_y = toInt(data.position_y);
    Board.find({ where : { id : board_id, visible : true } }).success(function(board) {
      Tag.create({ board_id : board_id, position_x : position_x, position_y : position_y }).success(function(tag) {
        broadcast(socket, 'createTag', tag);
      });
    });
  });

  // change tag
  socket.on('changeTag', function(data) {
    var updatedata = {
      id          : toInt(data.id),
      size_x      : toInt(data.size_x),
      size_y      : toInt(data.size_y),
      position_x  : toInt(data.position_x),
      position_y  : toInt(data.position_y),
    };
    Tag.find({ where : { id : updatedata.id, visible : true } }).success(function(tag) {
      tag.updateAttributes(updatedata).success(function(updatedtag) {
        broadcast(socket, 'updateTag', updatedtag);
      });
    });
  });

});

function toText(data) {
  data = sanitize(data).trim();
  data = sanitize(data).xss();
  return data;
}

function toInt(data) {
  return sanitize(data).toInt();
}

function broadcast(socket, name, arg) {
  socket.emit(name, arg);
  socket.broadcast.emit(name, arg);
}
