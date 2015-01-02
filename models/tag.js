// •tâ³
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Tag", {
    color : {
      type          : DataTypes.STRING,
      allowNull     : false,
      defaultValue  : "#b94a48"
    },
    backgroundColor : {
      type          : DataTypes.STRING,
      allowNull     : false,
      defaultValue  : "#f2dede"
    },
    top : {
      type          : DataTypes.INTEGER,
      allowNull     : false,
      set : function(top) {
        return this.setDataValue('top', (top < 0) ? 0 : top);
      }
    },
    left : {
      type          : DataTypes.INTEGER,
      allowNull     : false,
      set : function(left) {
        return this.setDataValue('left', (left < 0) ? 0 : left);
      }
    },
    width : {
      type          : DataTypes.INTEGER,
      allowNull     : false,
      defaultValue  : 260,
      set : function(width) {
        return this.setDataValue('width', (width < 260) ? 260 : width);
      }
    },
    height : {
      type          : DataTypes.INTEGER,
      allowNull     : false,
      defaultValue  : 260,
      set : function(height) {
        return this.setDataValue('height', (height < 100) ? 100 : height);
      }
    },
    visible : {
      type          : DataTypes.BOOLEAN,
      allowNull     : false,
      defaultValue  : true
    },
    zIndex : {
      type          : DataTypes.INTEGER,
      allowNull     : false,
      defaultValue  : 1
    },
  });
};
