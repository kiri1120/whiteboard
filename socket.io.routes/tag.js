// 付箋コントローラ
module.exports = {
  createTag : function(socket, data) {
    var BoardId = toInt(data.BoardId);
    var position_x = toInt(data.position_x);
    var position_y = toInt(data.position_y);
    Board.find(BoardId).success(function(board) {
      TagIndex.create().success(function(tagIndex) {
        var tag = Tag.build({ position_x : position_x, position_y : position_y });
        board.addTag(tag).success(function(createdTag) {
          createdTag.setTagIndex(tagIndex).success(function(){
            broadcast(socket, 'createTag', createdTag);
          });
        });
      });
    });
  },
  updateTag : function(socket, data) {
    var updatedata = {
      id                : toInt(data.id),
      color             : toText(data.color),
      background_color  : toText(data.background_color),
      size_x            : toInt(data.size_x),
      size_y            : toInt(data.size_y),
      position_x        : toInt(data.position_x),
      position_y        : toInt(data.position_y),
    };
    Tag.find(updatedata.id).success(function(tag) {
      if(tag == null || tag.visible == false) {
        socket.emit('error', '操作できない付箋です。');
      } else {
        tag.updateAttributes(updatedata).success(function(updatedTag) {
          broadcast(socket, 'updateTag', updatedTag);
        }).error(function(e) {
          socket.emit('error', e);
        });
      }
    });
  },
  closeTag : function(socket, data) {
    var id = toInt(data);
    Tag.find(id).success(function(tag) {
      if(tag == null || tag.visible == false) {
        socket.emit('error', '操作できない付箋です。');
      } else {
        tag.visible = false;
        tag.save().success(function() {
          broadcast(socket, 'deleteTag', id);
        }).error(function(e) {
          socket.emit('error', e);
        });
      }
    });
  },
  upZIndexTag : function(socket, data) {
    var id = toInt(data);
    Tag.find(id).success(function(tag) {
      
    });
  },
};

