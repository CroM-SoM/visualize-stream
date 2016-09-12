'use strict';
module.exports = function (sequelize, DataTypes) {
  var Analysis = sequelize.define('analysis', {
    row:{type: DataTypes.JSON, allowNull: false},
    result_1:{type:DataTypes.STRING},
    result_2:{type:DataTypes.STRING},
    result_3:{type:DataTypes.STRING}
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      { fields: ['deletedAt'] }
    ]
  });
  return Analysis;
};
