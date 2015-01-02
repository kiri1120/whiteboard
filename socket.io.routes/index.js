// socket.io コントローラ

// require modules
var boardControl    = require('./board'),
    tagControl      = require('./tag'),
    messageControl  = require('./message');

module.exports = function(socket) {
  // initStart
  socket.emit('initStart');
  User.findAll().success(function(rows) {
    var users = [];
    rows.forEach(function(user) {
      users[user.id] = user;
    });

    Board.findAll({ where: { visible: true }}).success(function(boards) {
      var boardIds = [];
      boards.forEach(function(board) {
        boardIds.push(board.id);
        socket.emit('createBoard', board);
      });
      Tag.findAll({ where : { BoardId : boardIds, visible : true }}).success(function(tags) {
        var tagIds = [];
        tags.forEach(function(tag) {
          tagIds.push(tag.id);
          socket.emit('createTag', { tag : tag, user : users[tag.UserId] });
        });
        Message.findAll({ where : { TagId : tagIds }}).success(function(messages) {
          messages.forEach(function(message) {
            message.message = message.message.replace(/http\:\/\/(www\.nicovideo\.jp\/watch|nico\.ms)\/([a-z0-9]+)/, function() {
              return '<script>function nico' + message.id + '(player){ player.write("nico-' + message.id + '"); }</script><script src="http://ext.nicovideo.jp/thumb_watch/' + RegExp.$2 + '?cb=nico' + message.id + '"></script><div id="nico-' + message.id + '"></div>';
            });
            socket.emit('showMessage', { user: users[message.UserId], message : message});
          });
          socket.emit('initEnd');
        });
      });
    });
  });

  // get session
  socket.on('session', function(data) {
    Session.find({ where : [ 'hash = ? AND ttl > ?', data, new Date() ] }).success(function(session) {
      if (session != null) {
        session.getUser().success(function(user) {
          if (user != null) {
            socket.set('user', user);
          }
        });
      }
    });
  });

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

  // up zindex tag
  socket.on('upZIndexTag', function(data) {
    tagControl.upZIndexTag(socket, data);
  });

  // down zindex tag
  socket.on('downZIndexTag', function(data) {
    tagControl.downZIndexTag(socket, data);
  });

  // commit message
  socket.on('commitMessage', function(data) {
    messageControl.commitMessage(socket, data);
  });
}
