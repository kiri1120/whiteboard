// 付箋コントローラ
module.exports = {
  createTag : function(socket, data) {
    var BoardId = toInt(data.BoardId);
    var position_x = toInt(data.position_x);
    var position_y = toInt(data.position_y);
    Board.find(BoardId).success(function(board) {
      var tag = Tag.build({ position_x : position_x, position_y : position_y });
      board.addTag(tag).success(function(createdTag) {
        broadcast(socket, 'createTag', createdTag);
      });
    });
  },
  updateTag : function(socket, data) {
    var updatedata = {
      id          : toInt(data.id),
      size_x      : toInt(data.size_x),
      size_y      : toInt(data.size_y),
      position_x  : toInt(data.position_x),
      position_y  : toInt(data.position_y),
    };
    Tag.find(updatedata.id).success(function(tag) {
      tag.updateAttributes(updatedata).success(function(updatedTag) {
        broadcast(socket, 'updateTag', updatedTag);
      });
    });
  },
};

