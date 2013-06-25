module.exports = {
  commitMessage : function(socket, data) {
    var tagid = toInt(data.tagid);
    var msg = toText(data.message);
    if (msg == '') {
      return;
    }
    socket.get('user', function(err, user) {
      Message.create({ UserId : user.id, TagId : tagid, message : msg }).success(function(message) {
        broadcast(socket, 'showMessage', { user : user, message : message });
      });
    });
  }
};