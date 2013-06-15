// config
var config = require('config');

// socket.io
var io = require('socket.io').listen(config.socket_io);

// validator
var check = require('validator').check;
var sanitize = require('validator').sanitize;

// sprintf
var sprintf = require('sprintf').sprintf;

// MySQL ORM 
var ORM = require("./models");
var sequelize = ORM.sequelize;
var models = ORM,models;

/*
io.sockets.on('connection', function(socket) {
}
*/

