// ユーザー
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    userid:           { type: DataTypes.STRING, allowNull: false, unique: true },
    nickname:         { type: DataTypes.STRING, allowNull: false, unique: true },
    password:         { type: DataTypes.STRING, allowNull: false },
  });
};
