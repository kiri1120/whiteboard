module.exports = {
  index : function(req, res) {
    if (req.session.hash == null) {
      redirect(req, res, '/login');
    } else {
      Session.find({ where : [ 'hash = ? AND ttl > ?', req.session.hash, Date.now()] }).success(function(session){
        req.session.hash = session.hash;
        res.render('index', { title: config.title });
      }).error(function() {
        redirect(req, res, '/login');
      });
    }
  },
  login : require('./login'),
}
