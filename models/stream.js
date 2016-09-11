'use strict';
module.exports = function (sequelize, DataTypes) {
    var Stream = sequelize.define('stream', {
      /*  created_at: {type: DataTypes.STRING, allowNull: true},
        text: {type: DataTypes.STRING, allowNull: true},
        id_str: {type: DataTypes.STRING, allowNull: true},
        name: {type: DataTypes.STRING, allowNull: true},
        screen_name: {type: DataTypes.STRING, allowNull: true},
        location: {type: DataTypes.STRING, allowNull: true},
        description: {type: DataTypes.STRING, allowNull: true},
        time_zone: {type: DataTypes.STRING, allowNull: true},
        geo_enabled: {type: DataTypes.STRING, allowNull: true},
        lang: {type: DataTypes.STRING, allowNull: true},
        coordinates: {type: DataTypes.STRING, allowNull: true},
        place_type: {type: DataTypes.STRING, allowNull: true},
        place_name: {type: DataTypes.STRING, allowNull: true},
        place_full_name: {type: DataTypes.STRING, allowNull: true},
        place_country_code: {type: DataTypes.STRING, allowNull: true},
        place_country: {type: DataTypes.STRING, allowNull: true},
        bounding_box_type: {type: DataTypes.STRING, allowNull: true},
        bounding_coordinates: {type: DataTypes.STRING, allowNull: true},
        bounding_attributes: {type: DataTypes.STRING, allowNull: true},
        timestamp_ms: {type: DataTypes.STRING, allowNull: true},*/
        row:{type: DataTypes.JSON, allowNull: false}
    }, {
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['deletedAt'] }
        ]
    });

    return Stream;
};
