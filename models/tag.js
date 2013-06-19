// �t�
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Tag", {
    board_id:         { type: DataTypes.INTEGER, allowNull: false },
    color:            { type: DataTypes.STRING, defaultValue: "#b94a48"},
    background_color: { type: DataTypes.STRING, defaultValue: "#f2dede"},
    position_x:       { type: DataTypes.INTEGER, allowNull: false },
    position_y:       { type: DataTypes.INTEGER, allowNull: false },
    size_x:           { type: DataTypes.INTEGER, defaultValue: 260 },
    size_y:           { type: DataTypes.INTEGER, defaultValue: 260 },
    visible:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  });
};
