// メッセージ
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Message", {
    message:  { type: DataTypes.TEXT, allowNull: false },
  });
};
