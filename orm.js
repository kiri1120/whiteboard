var config = require('config');
var Sequelize = require('sequelize');

exports.models = {};
exports.sequelize = new Sequelize(config.mysql);

exports.models.Board = exports.sequelize.define('Board', {
  name: Sequelize.STRING,
  visible : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
});

exports.models.Massage = exports.sequelize.define('Massage', {
  user_id:  Sequelize.INTEGER,
  tag_id:   Sequelize.INTEGER,
  message:  Sequelize.TEXT,
});
exports.models.Session = exports.sequelize.define('Session', {
  user_id:  Sequelize.INTEGER,
  hash:     'CHAR(40)',
  ttl:      Sequelize.DATE,
});

exports.models.Tag = exports.sequelize.define('Tag', {
  board_id:         Sequelize.INTEGER,
  color:            Sequelize.STRING,
  background_color: Sequelize.STRING,
  position_x:       Sequelize.INTEGER,
  position_y:       Sequelize.INTEGER,
  size_x:           Sequelize.INTEGER,
  size_y:           Sequelize.INTEGER,
  visible:          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
});

exports.models.User = exports.sequelize.define('User', {
  userid: { type: Sequelize.STRING, unique: true },
  nickname: Sequelize.STRING,
  password: 'char(40)',
}
,{
  classMethods: {
    hashPassword: function(pass) {
      return require('crypto').createHash('sha1').update(pass, 'utf8').digest('hex');
    }
  }
});
