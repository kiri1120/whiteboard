module.exports = {
  post : function(req, res) {
    var userid = toText(req.body.userid);
    var password = toText(req.body.password);
    var nickname = toText(req.body.nickname);

    if (userid == '')   { res.render('login', { title : config.title, error : 'UserIDが未入力です' }); }
    if (password == '') { res.render('login', { title : config.title, error : 'Passwordが未入力です' }); }
    if (nickname == '') { res.render('login', { title : config.title, error : '名前が未入力です' }); }

    User.find({ where : { userid : userid } }).success(function(user) {
      if (user == null) {
        User.create({ userid : userid, password : hash(password), nickname : nickname }).success(function(user) {
          var session = Session.createSession();
          user.addSession(session).success(function(createdSession) {
            req.session.hash = createdSession.hash;
            redirect(req, res, '/');
          }).error(function(e) {
            res.render('login', { title : config.title, error : e });
          });
        }).error(function(e) {
          res.render('login', { title : config.title, error : e });
        });
      } else {
        res.render('login', { title : config.title, error : 'すでに存在するユーザーです。' });
      }
    });
  },
};
