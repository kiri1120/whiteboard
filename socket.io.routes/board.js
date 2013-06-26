// ホワイドボードコントローラ
module.exports = {
  createBoard : function(socket, data) {
    var name = toText(data);
    if (name == "") {
      socket.emit('error', 'can not create board to empty');
      return;
    }
    Board.create({ name : name }).success(function(board) {
      broadcast(socket, 'createBoard', board);
    });
  },
  deleteBoard : function(socket, data) {
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
  },
  renameBoard : function(socket, data) {
    var id = toInt(data.id);
    var name = toText(data.name);
    if (name == "") {
      socket.emit('error', 'can not rename board to empty');
      return;
    }
    Board.find(id).success(function(board) {
      board.updateAttributes({ name : name }).success(function() {
        broadcast(socket, 'renameBoard', board);
      });
    });
  }
};
