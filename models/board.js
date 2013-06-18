// ホワイトボード
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Board", {
    name    : { type: DataTypes.STRING, allowNull: false },
    visible : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
};
