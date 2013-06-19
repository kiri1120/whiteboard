// require libs
var config = require('config'),
    Sequelize = require('sequelize');

// connecttion
var sequelize = new Sequelize(config.mysql);

// models imports
var Board   = sequelize.import(__dirname + "/models/board"),
    Tag     = sequelize.import(__dirname + "/models/tag"),
    Message = sequelize.import(__dirname + "/models/message");

// initialize
sequelize.sync({ force : true }).success(function() {
  Board.findOrCreate({ name : "first board" });
});
