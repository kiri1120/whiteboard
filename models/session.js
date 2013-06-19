// セッション
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Session", {
    hash:             { type: DataTypes.STRING,   allowNull: false },
    ttl:              { type: DataTypes.DATE,     allowNull: false },
  }
  ,{
    classMethods : {
      createSession : function() {
        return Session.build({
          hash : uid(40),
          ttl  : Session.getNewTtl(), 
        });
      },
      getNewTtl : function() {
        return new Date(Date.now() + 60 * 60 * 1000); // 1時間
      },
    }
  });
};
