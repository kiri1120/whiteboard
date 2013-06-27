// •tâ³
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Tag", {
    color:            { type: DataTypes.STRING, allowNull: false, defaultValue: "#b94a48"},
    background_color: { type: DataTypes.STRING, allowNull: false, defaultValue: "#f2dede"},
    position_x:       { type: DataTypes.INTEGER, allowNull: false },
    position_y:       { type: DataTypes.INTEGER, allowNull: false },
    size_x:           { type: DataTypes.INTEGER, allowNull: false, defaultValue: 260 },
    size_y:           { type: DataTypes.INTEGER, allowNull: false, defaultValue: 260 },
    visible:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
};
