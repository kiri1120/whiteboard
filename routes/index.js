module.exports = {
  index : function(req, res) {
    if (req.session.hash == null) {
      redirect(req, res, '/login');
    } else {
      Session.find({ where : [ 'hash = ? AND ttl > ?', req.session.hash, new Date()] }).success(function(session){
        if (session == null) {
          redirect(req, res, '/login');
        } else {
          session.ttl = Session.getNewTtl();
          session.save();
          req.session.hash = session.hash;
          session.getUser().success(function(user) {
            res.render('index', { title: config.title, user : user });
          });
        }
      });
    }
  },
  login : require('./login'),
  signup : require('./signup'),
}
