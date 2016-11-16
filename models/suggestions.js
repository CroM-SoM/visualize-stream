'use strict';
module.exports = function (sequelize, DataTypes) {
  var Suggestions = sequelize.define('suggestions', {
    user_id:{type:DataTypes.STRING,allowNull:false},
    tourist:{type:DataTypes.JSON,allowNull:false},
    event:{type:DataTypes.JSON,allowNull:false}
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['deletedAt'] }
    ]
  });
  return Suggestions;
};
