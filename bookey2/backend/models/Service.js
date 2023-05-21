const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connection");

const Service = sequelize.define("services", {
    Service_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'Service_ID'
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Name'
    },
    Location: {
        type: DataTypes.STRING,
        field: 'Location'
    },
    Timestamp: {
        type: DataTypes.DATE,
        field: 'Timestamp'
    },
    Youtube_URL: {
        type: DataTypes.STRING,
        field: 'Youtube_URL'
    },
    Instagram_URL: {
        type: DataTypes.STRING,
        field: 'Instagram_URL'
    },
    Twitter_URL: {
        type: DataTypes.STRING,
        field: 'Twitter_URL'
    },
    Facebook_URL: {
        type: DataTypes.STRING,
        field: 'Facebook_URL'
    },
    Coordinates: {
        type: DataTypes.STRING,
        field: 'Coordinates'
    }
},
{
    timestamps: false
});

module.exports = Service;
