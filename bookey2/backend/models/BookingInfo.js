const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');
const Service = require('./Service');

const BookingInfo = sequelize.define('booking_info', {
  Booking_ID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    field: 'Booking_ID'
  },
  Address: {
    type: DataTypes.STRING,
    field: 'Address'
  },
  Contact: {
    type: DataTypes.STRING,
    field: 'Contact'
  },
  Email: {
    type: DataTypes.STRING,
    field: 'Email'
  },
  Name: {
    type: DataTypes.STRING,
    field: 'Name'
  },
  Message: {
    type: DataTypes.STRING,
    field: 'Message'
  },
  Service_Name: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: Service,
      key: 'Name'
    },
    field: 'Service_Name'
  }
},
{
    timestamps: false
});

BookingInfo.belongsTo(Service, { foreignKey: 'Service_Name' });

module.exports = BookingInfo;
