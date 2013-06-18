// メッセージ
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Message", {
    user_id:  { type: DataTypes.INTEGER, allowNull: false },
    tag_id:   { type: DataTypes.INTEGER, allowNull: false },
    message:  { type: DataTypes.TEXT, allowNull: false },
  });
};
