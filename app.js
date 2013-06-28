
/**
 * Module dependencies.
 */

var express   = require('express'),
    http      = require('http'),
    path      = require('path'),
    ORM       = require('sequelize'),
    SocketIO  = require('socket.io'),
    check     = require('validator').check,
    sanitize  = require('validator').sanitize,
    crypto    = require('crypto'),
    SPF       = require('sprintf');
    routes    = require('./routes'),

// global settings
config = require('config');

// global functions
toText = function(data) {
  data = sanitize(data).trim();
  data = sanitize(data).xss();
  data = sanitize(data).escape();
  return data;
};
toInt = function(data) {
  data = sanitize(data).toInt();
  if (data < 0) { data = 0; }
  return data;
};
broadcast = function(socket, name, arg) {
  socket.emit(name, arg);
  socket.broadcast.emit(name, arg);
};
redirect = function(req, res, target) {
  res.redirect('http://' + req.header('host') + target);
};
hash = function(str) {
  return crypto.createHash('sha1').update(str, 'utf8').digest('hex');
};
uid = function(size) {
  size = size || 32;
  var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var len = base.length;

  var buf = [];
  for(var i=0; i<size; ++i) {
    buf.push(base[Math.floor(Math.random() * len)]);
  }
  return buf.join('');
};
sprintf = SPF.sprintf;
toString  = JSON.stringify;

// models imports
var sequelize = new ORM(config.mysql);
Board   = sequelize.import(__dirname + "/models/board");
Tag     = sequelize.import(__dirname + "/models/tag");
Message = sequelize.import(__dirname + '/models/message');
User    = sequelize.import(__dirname + '/models/user');
Session = sequelize.import(__dirname + '/models/session');

// model associations
Board.hasMany(Tag);
Tag.hasMany(Message);
Message.belongsTo(User);
Message.belongsTo(Tag);
User.hasMany(Message);
User.hasMany(Session);
Session.belongsTo(User);

var app = express();

// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('trust proxy', true);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.get('/login', routes.login.get);
app.post('/login', routes.login.post);
app.post('/signup', routes.signup.post);
app.post('/logout', routes.logout.post);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = SocketIO.listen(server);
server.listen(app.get('port'));
io.sockets.on('connection', require('./socket.io.routes'));

