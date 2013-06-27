module.exports = {
  post : function(req, res) {
    var userid = toText(req.body.userid);
    var password = toText(req.body.password);
    var nickname = toText(req.body.nickname);

    var error = null;

    if (userid == '')   {
      error = 'UserIDが未入力です';
    } else if (password == '') {
      error = 'Passwordが未入力です';
    } else if (nickname == '') {
      error = '名前が未入力です';
    }

    if (error == null) {
      User.find({ where : { userid : userid } }).success(function(user) {
        if (user == null) {
          User.create({ userid : userid, password : hash(password), nickname : nickname }).success(function(user) {
            var session = Session.createSession();
            user.addSession(session).success(function(createdSession) {
              res.cookie('session', createdSession.hash, { maxAge : config.session.expire });
              redirect(req, res, '/');
              return;
            }).error(function(e) {
              error = e;
            });
          }).error(function(e) {
            error = e;
          });
        } else {
          error = 'すでに存在するユーザーです。';
        }
      });
    }

    if (error != null) {
      res.render('error', { error : error });
    }
  },
};
