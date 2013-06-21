// socket.io コントローラ

// require modules
var boardControl = require('./board');
var tagControl   = require('./tag');

module.exports = function(socket) {
  // initStart
  socket.emit('initStart');
  Board.findAll({ where: { visible: true } }).success(function(boards) {
    boards.forEach(function(board) {
      socket.emit('createBoard', board);
      board.getTags({ where : { visible : true }}).success(function(tags) {
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
    boardControl.createBoard(socket, data);
  });

  // delete board
  socket.on('deleteBoard', function(data) {
    boardControl.deleteBoard(socket, data);
  });

  // rename board
  socket.on('renameBoard', function(data) {
    boardControl.renameBoard(socket, data);
  });

  // create tag
  socket.on('createTag', function(data) {
    tagControl.createTag(socket, data);
  });

  // change tag
  socket.on('changeTag', function(data) {
    tagControl.updateTag(socket, data);
  });

  // close tag
  socket.on('closeTag', function(data) {
    tagControl.closeTag(socket, data);
  });
}
