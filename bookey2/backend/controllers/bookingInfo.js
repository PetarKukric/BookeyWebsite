const BookingInfo = require('../models/BookingInfo');
const Service = require('../models/Service');
const { verifyAuth } = require("./utils.js");

// Create a new booking info
exports.createBookingInfo = async (req, res) => {
  try {
    const userAuth = verifyAuth(req, res, {authType: "User", Email: req.body.email});
    if(!userAuth.authorized){
        res.status(401).json({message: userAuth.message});
        return;
    }

    const { address, contact, email, name, message, serviceName } = req.body;
    
    const service = await Service.findOne({ where: { Name: serviceName } });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const bookingInfo = await BookingInfo.create({
      Address: address,
      Contact: contact,
      Email: email,
      Name: name,
      Message: message,
      Service_Name: serviceName
    });
    
    res.status(201).json(bookingInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all booking infos
exports.getAllBookingInfos = async (req, res) => {
  try {
    const userAuth = verifyAuth(req, res, { authType: "Admin" });
    if(!userAuth.authorized) {
        res.status(401).json(userAuth.message);
        return;
    }

    const bookingInfos = await BookingInfo.findAll();
    res.status(200).json(bookingInfos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single booking info by ID
exports.getBookingInfoByUser = async (req, res) => {
  const bookingInfoEmail = req.body.email;
  try {
    const userAuth = verifyAuth(req, res, {authType: "User", Email: bookingInfoEmail});
    if(!userAuth.authorized){
        res.status(401).json({message: userAuth.message});
        return;
    }

    const bookingInfosByEmail = await BookingInfo.findOne({ where: { Email: bookingInfoEmail } });
    
    if (!bookingInfosByEmail) {
      return res.status(404).json({ message: 'Booking info not found' });
    }
    
    res.status(200).json(bookingInfosByEmail);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a booking info
exports.updateBookingInfo = async (req, res) => {
  const bookingInfoId = req.params.id;
  try {
    const userAuth = verifyAuth(req, res, {authType: "User", Email: req.body.email});
    if(!userAuth.authorized){
        res.status(401).json({message: userAuth.message});
        return;
    }

    const { address, contact, email, name, message, serviceName } = req.body;
    
    const bookingInfo = await BookingInfo.findOne({ where: { Booking_ID: bookingInfoId, Email: email } });
    
    if (!bookingInfo) {
      return res.status(404).json({ message: 'Booking info not found for this user' });
    }
    
    const service = await Service.findOne({ where: { Name: serviceName } });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    bookingInfo.Address = address;
    bookingInfo.Contact = contact;
    bookingInfo.Email = email;
    bookingInfo.Name = name;
    bookingInfo.Message = message;
    bookingInfo.Service_Name = serviceName;
    
    await bookingInfo.save();
    
    res.status(200).json(bookingInfo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a booking info
exports.deleteBookingInfo = async (req, res) => {
  const bookingInfoId = req.params.id;
  try {
    const userAuth = verifyAuth(req, res, {authType: "User", Email: req.body.email});
    if(!userAuth.authorized){
        res.status(401).json({message: userAuth.message});
        return;
    }

    const bookingInfo = await BookingInfo.findOne({ where: { Booking_ID: bookingInfoId, Email: req.body.email } });
    if (!bookingInfo) {
      return res.status(404).json({ message: 'Booking info not found for this user' });
    }
    
    await bookingInfo.destroy();
    
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
