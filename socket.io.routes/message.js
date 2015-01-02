// メッセージ処理
module.exports = {
  commitMessage : function(socket, data) {
    var tagid = toInt(data.tagid);
    var msg = toText(data.message);
    if (msg == '') {
      return;
    }

    socket.get('user', function(err, user) {
      Message.create({ UserId : user.id, TagId : tagid, message : msg }).success(function(message) {
        // niconico対応してみる
        message.message = message.message.replace(/http\:\/\/(www\.nicovideo\.jp\/watch|nico\.ms)\/([a-z0-9]+)/, function() {
          return '<script>function nico' + message.id + '(player){ player.write("nico-' + message.id + '"); }</script><script src="http://ext.nicovideo.jp/thumb_watch/' + RegExp.$2 + '?cb=nico' + message.id + '"></script><div id="nico-' + message.id + '"></div>';
        });
        broadcast(socket, 'showMessage', { user : user, message : message });
      });
    });
  }
};