// ホワイドボードコントローラ
module.exports = {
  createBoard : function(socket, data) {
    var name = toText(data);
    if (name == "") {
      socket.emit('error', 'ホワイトボードに名前をつけてください。');
      return;
    }
    Board.count({ where : { visible : true }}).success(function(count) {
      if (count >= config.maxboard) {
        socket.emit('error', 'ホワイトボードの作成上限に達しました。（上限：' + config.maxboard + '）');
        return;
      }
      Board.create({ name : name }).success(function(board) {
        broadcast(socket, 'createBoard', board);
      });
    });
  },
  deleteBoard : function(socket, data) {
    Board.count({ where : { visible : true }}).success(function(count) {
      if (count <= 1) {
        socket.emit('error', 'ホワイトボードをこれ以上削除出来ません。');
        return;
      }
      var id = toInt(data);
      Board.find(id).success(function(board){
        board.visible = false;
        board.save().success(function() {
          broadcast(socket, 'deleteBoard', board);
        });
      });
    });
  },
  renameBoard : function(socket, data) {
    var id = toInt(data.id);
    var name = toText(data.name);
    if (name == "") {
      socket.emit('error', 'ホワイトボードの名前を空にすることはできません。');
      return;
    }
    Board.find(id).success(function(board) {
      board.updateAttributes({ name : name }).success(function() {
        broadcast(socket, 'renameBoard', board);
      });
    });
  }
};
