// •tâ³
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Tag", {
    color:            { type: DataTypes.STRING, allowNull: false, defaultValue: "#b94a48"},
    backgroundColor:  { type: DataTypes.STRING, allowNull: false, defaultValue: "#f2dede"},
    top:              { type: DataTypes.INTEGER, allowNull: false },
    left:             { type: DataTypes.INTEGER, allowNull: false },
    width:            { type: DataTypes.INTEGER, allowNull: false, defaultValue: 260 },
    height:           { type: DataTypes.INTEGER, allowNull: false, defaultValue: 260 },
    visible:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    zIndex:           { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  });
};
