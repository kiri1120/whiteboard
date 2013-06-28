// 付箋コントローラ
module.exports = {
  createTag : function(socket, data) {
    var BoardId = toInt(data.BoardId);
    var position_x = toInt(data.position_x);
    var position_y = toInt(data.position_y);

    Board.find(BoardId).success(function(board) {
      if (board == null) {
        socket.emit('error', '存在しないホワイトボードに付箋を貼ろうとしています。BoardId : ' + BoardId);
        return;
      }
      Tag.count({ where : { BoardId : board.id, visible : true }}).success(function(count) {
        if (count >= config.maxtag) {
          socket.emit('error', '一枚のホワイトボードに貼れる付箋の上限に達しました。（上限：' + config.maxtag +'）');
          return;
        }
        TagIndex.create().success(function(tagIndex) {
          var tag = {
            position_x  : position_x,
            position_y  : position_y,
            BoardId     : BoardId,
            TagIndexId  : TagIndex.id
          };
          Tag.create(tag).success(function(createdTag) {
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
      if(tag == null) {
        return;
      }
      tag.updateAttributes(updatedata).success(function(updatedTag) {
        broadcast(socket, 'updateTag', updatedTag);
      }).error(function(e) {
        socket.emit('error', e);
      });
    });
  },
  closeTag : function(socket, data) {
    var id = toInt(data);
    Tag.find(id).success(function(tag) {
      if(tag == null) {
        return;
      }
      tag.visible = false;
      tag.save().success(function() {
        broadcast(socket, 'deleteTag', id);
      }).error(function(e) {
        socket.emit('error', e);
      });
    });
  },
  upZIndexTag : function(socket, data) {
    var id = toInt(data);
    Tag.find(id).success(function(tag) {
      if (tag == null) {
        return;
      }
      Tag.find({ where : [ 'BoardId = ? AND visible = ? AND TagIndexId > ?', tag.BoardId, true, tag.TagIndexId ] }).success(function(nextTag) {
        if (nextTag == null) {
          return;
        }
        var tmpTagIndexId = tag.TagIndexId;
        tag.TagIndexId = nextTag.TagIndexId;
        nextTag.TagIndexId = tmpTagIndexId;
        tag.save().success(function(savedTag) {
          broadcast(socket, 'updateTag', savedTag);
        });
        nextTag.save().success(function(savedNextTag) {
          broadcast(socket, 'updateTag', savedNextTag);
        });
      });
    });
  },
  downZIndexTag : function(socket, data) {
    var id = toInt(data);
    Tag.find(id).success(function(tag) {
      if (tag == null) {
        return;
      }
      Tag.find({ where : [ 'BoardId = ? AND visible = ? AND TagIndexId < ?', tag.BoardId, true, tag.TagIndexId ] }).success(function(prevTag) {
        if (prevTag == null) {
          return;
        }
        var tmpTagIndexId = tag.TagIndexId;
        tag.TagIndexId = prevTag.TagIndexId;
        prevTag.TagIndexId = tmpTagIndexId;
        tag.save().success(function(savedTag) {
          broadcast(socket, 'updateTag', savedTag);
        });
        prevTag.save().success(function(savedPrevTag) {
          broadcast(socket, 'updateTag', savedPrevTag);
        });
      });
    });
  },
};

