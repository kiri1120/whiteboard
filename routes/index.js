module.exports = {
  index : function(req, res) {
    if (req.cookies.session == null) {
      redirect(req, res, '/login');
    } else {
      Session.find({ where : [ 'hash = ? AND ttl > ?', req.cookies.session, new Date()] }).success(function(session){
        if (session == null) {
          redirect(req, res, '/login');
        } else {
          session.ttl = Session.getNewTtl();
          session.save();
          res.cookie('session', session.hash, { maxAge: config.session.expire });
          session.getUser().success(function(user) {
            res.render('index', { title: config.title, user : user });
          });
        }
      });
    }
  },
  login   : require('./login'),
  logout  : require('./logout'),
  signup  : require('./signup'),
}
