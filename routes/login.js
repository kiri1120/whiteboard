module.exports = {
  get : function(req, res) {
    res.render('login');
  },
  post : function(req, res) {
    var userid = toText(req.body.userid);
    var password = toText(req.body.password);

    User.find({ where : { userid : userid, password : hash(password) } }).success(function(user) {
      if (user == null) {
        res.render('error', { error : 'ログインに失敗しました。' });
      } else {
        var session = Session.createSession();
        user.addSession(session).success(function(createdSession) {
          res.cookie('session', createdSession.hash, { maxAge: config.session.expire }); ;
          redirect(req, res, '/');
        }).error(function(e){
          res.render('error', { error : e });
        });
      }
    });
  },
};
