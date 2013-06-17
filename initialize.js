var ORM = require('./orm');
var sequelize = ORM.sequelize;

sequelize.sync({ force : true }).success(function() {
  var Board = ORM.models.Board;
  Board.findOrCreate({ name : "first board" }).success(function(board, created) {
    console.log(board.values)
    console.log(created)
  });
});
