var ORM = require('./models');
var sequelize = ORM.sequelize;
var models = ORM.models;

sequelize.sync({ force: true }).success(function() {
  models.Board.create({name: '1st board'});
});
