
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
    routes    = require('./routes'),
    SPF       = require('sprintf');

// global settings
config = require('config');

// global functions
toText = function(data) {
  data = sanitize(data).trim();
  data = sanitize(data).xss();
  return data;
};
toInt = function(data) {
  return sanitize(data).toInt();
};
broadcast = function(socket, name, arg) {
  socket.emit(name, arg);
  socket.broadcast.emit(name, arg);
};
redirect = function(req, res, target) {
  res.redirect('http://' + req.header('host') + target);
};
hash = function(str) {
  return require('crypto').createHash('sha1').update(str, 'utf8').digest('hex');
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

// session store
app.use(express.cookieParser());
app.use(express.session({
  secret: 'webwhiteboard',
  cookie: { maxAge: new Date(Date.now() + 60 * 60 * 1000)  // 1ŽžŠÔ
}}));

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

// express 3.x Socket.IO compatibility
var io = SocketIO.listen(server);
server.listen(config.port);
io.sockets.on('connection', require('./socket.io.routes'));

