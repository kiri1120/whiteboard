// 付箋コントローラ
module.exports = {
  createTag : function(socket, data) {
    var BoardId = toInt(data.BoardId);
    var top = toInt(data.top);
    var left = toInt(data.left);

    socket.get('user', function(err, user) {
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
          Tag.max('zIndex').success(function(zIndexMax) {
            if (isNaN(zIndexMax)) {
              zIndexMax = 0;
            }
            var tag = {
              top     : top,
              left    : left,
              zIndex  : zIndexMax + 1,
              BoardId : BoardId,
              UserId  : user.id,
            };
            Tag.create(tag).success(function(createdTag) {
              broadcast(socket, 'createTag', { tag : createdTag, user : user });
            });
          });
        });
      });
    });
  },
  updateTag : function(socket, data) {
    var id = toInt(data.id);
    Tag.find(id).success(function(tag) {
      if(tag == null) {
        return;
      }
      tag.color           = toText(data.color);
      tag.backgroundColor = toText(data.backgroundColor);
      tag.width           = toInt(data.width);
      tag.height          = toInt(data.height);
      tag.top             = toInt(data.top);
      tag.left            = toInt(data.left);
      tag.save().success(function(updatedTag) {
        broadcast(socket, 'updateTag', updatedTag);
      }).error(function(e) {
        socket.emit('error', toString(e));
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
      Tag.max('zIndex').success(function(zIndexMax) {
        tag.zIndex = zIndexMax + 1;
        tag.save().success(function(savedTag) {
          broadcast(socket, 'updateTag', savedTag);
        });
      });
    });
  },
};

