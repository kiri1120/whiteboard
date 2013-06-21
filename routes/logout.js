// ログアウト
module.exports = {
  post : function(req, res) {
    Session.find({ where : { hash : req.cookies.session } }).success(function(session) {
      if (session != null) {
        session.ttl = new Date(0);
        session.save();
      }
      res.clearCookie('session');
      redirect(req, res, '/');
    });
  },
};
