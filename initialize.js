// require libs
var config = require('config'),
    ORM = require('sequelize');

// connecttion
var sequelize = new ORM(config.mysql);

// models imports
var Board   = sequelize.import(__dirname + '/models/board'),
    Tag     = sequelize.import(__dirname + '/models/tag'),
    Message = sequelize.import(__dirname + '/models/message'),
    User    = sequelize.import(__dirname + '/models/user'),
    Session = sequelize.import(__dirname + '/models/session'),
    TagIndex = sequelize.import(__dirname + '/models/tagindex');

// Associations
Board.hasMany(Tag);
Tag.hasMany(Message);
Message.belongsTo(User);
Message.belongsTo(Tag);
User.hasMany(Message);
User.hasMany(Session);
Session.belongsTo(User);
Tag.belongsTo(TagIndex);
TagIndex.hasOne(Tag);

// initialize
sequelize.sync({ force : true }).success(function() {
  Board.findOrCreate({ name : "first board" });
});
