const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const User = sequelize.define('users', {
    User_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'User_ID'
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Name'
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'Email'
    },
    Password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Password'
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'isAdmin'
    },
    Refresh_Token: {
        type: DataTypes.STRING,
        field: 'Refresh_Token'
    }
},
{
    timestamps: false
});
  
module.exports = User;