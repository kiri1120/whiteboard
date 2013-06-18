// ホワイトボード
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Board", {
    name: DataTypes.STRING,
    visible : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  })
}
