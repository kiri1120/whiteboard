module.exports = {
  index : function(req, res) {
    if (req.cookies.session == null) {
      redirect(req, res, '/login');
    } else {
      Session.find({ where : [ 'hash = ? AND ttl > ?', req.cookies.session, new Date()] }).success(function(session){
        if (session == null) {
          redirect(req, res, '/login');
        } else {
          session.getUser().success(function(user) {
            if (user == null) {
              redirect(req, res, '/login');
            } else {
              console.log('[debug] user : ' + JSON.stringify(user));
              session.ttl = Session.getNewTtl();
              session.save();
              res.cookie('session', session.hash, { maxAge: config.session.expire });
              res.render('index', { user : user });
            }
          });
        }
      });
    }
  },
  login   : require('./login'),
  logout  : require('./logout'),
  signup  : require('./signup'),
}
