// メッセージ
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Message", {
    user_id:  DataTypes.INTEGER,
    tag_id:   DataTypes.INTEGER,
    message:  DataTypes.TEXT,
  })
}
