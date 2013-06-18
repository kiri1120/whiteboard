// •tâ³
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Tag", {
    board_id:         DataTypes.INTEGER,
    color:            DataTypes.STRING,
    background_color: DataTypes.STRING,
    position_x:       DataTypes.INTEGER,
    position_y:       DataTypes.INTEGER,
    size_x:           DataTypes.INTEGER,
    size_y:           DataTypes.INTEGER,
    visible:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  })
}
