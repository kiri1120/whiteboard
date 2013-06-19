module.exports = {
  get : function(req, res) {
    res.render('login', { title : config.title });
  },
  post : function(req, res) {
    var userid = toText(req.body.userid);
    var password = toText(req.body.password);

    User.find({ where : { userid : userid, password : User.hashPassword(password) } }).success(function(user) {
      var session = Session.createSession();
      user.addSession(session).success(function(createdSession) {
        req.session.hash = createdSession.hash;
        redirect(req, res, '/');
      }).error(function(e){
        res.render('login', { title : config.title, error : e });
      });
    }).error(function() {
      res.render('login', { title : config.title, error : 'ログインに失敗しました。' });
    });
  },
};
