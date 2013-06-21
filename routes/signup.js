module.exports = {
  post : function(req, res) {
    var userid = toText(req.body.userid);
    var password = toText(req.body.password);
    var nickname = toText(req.body.nickname);

    if (userid == '')   {
      res.render('error', { error : 'UserIDが未入力です' });
      return;
    }
    if (password == '') {
      res.render('error', { error : 'Passwordが未入力です' });
      return;
    }
    if (nickname == '') {
      res.render('error', { error : '名前が未入力です' });
      return;
    }

    User.find({ where : { userid : userid } }).success(function(user) {
      if (user == null) {
        User.create({ userid : userid, password : hash(password), nickname : nickname }).success(function(user) {
          var session = Session.createSession();
          user.addSession(session).success(function(createdSession) {
            res.cookie('session', createdSession.hash, { maxAge : config.session.expire });
            redirect(req, res, '/');
          }).error(function(e) {
            res.render('error', { error : e });
          });
        }).error(function(e) {
          res.render('error', { error : e });
        });
      } else {
        res.render('error', { error : 'すでに存在するユーザーです。' });
      }
    });
  },
};
