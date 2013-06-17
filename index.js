// config
var config = require('config');

// socket.io
var io = require('socket.io').listen(config.socket_io);

// validator
var check = require('validator').check;
var sanitize = require('validator').sanitize;

// sprintf
var sprintf = require('sprintf').sprintf;

// MySQL ORM
var ORM = require("./orm");
var sequelize = ORM.sequelize;
var Board   = ORM.models.Board,
    Tag     = ORM.models.Tag,
    Message = ORM.models.Message;

io.sockets.on('connection', function(socket) {
  initialize(socket);
  
  function initialize(socket) {
    socket.emit('initialize');
    Board.findAll({ where: { visible: true } }).success(function(boards) {
      boards.forEach(function(board){
        socket.emit('createBoard', board);
      });
    })
  }
}
