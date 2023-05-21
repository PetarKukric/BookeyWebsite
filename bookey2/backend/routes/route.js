const express = require('express');
const { login, logout, register, registerAdmin } = require("../controllers/auth.js");
const { getAllUsers, getUserByEmail, deleteUser } = require("../controllers/users.js");
const { getAllServices, getServiceByName, createService, updateService, deleteService } = require("../controllers/services.js");
const { getAllBookingInfos, getBookingInfoByUser, createBookingInfo, updateBookingInfo, deleteBookingInfo } = require("../controllers/bookingInfo.js");


const router = express.Router();

/**
 * Routes that do not require authentication
 */
router.post('/register', register);
router.post('/admin', registerAdmin);
router.post('/login', login);

/**
 * Routes for authenticated users
 */
router.get('/user', getUserByEmail);
router.get('/services', getAllServices);
router.get('/service/:name', getServiceByName);
router.get('/bookingInfo', getBookingInfoByUser);
router.post('/bookingInfo', createBookingInfo);
router.patch('/bookingInfo/:id', updateBookingInfo);
router.delete('/bookingInfo/:id', deleteBookingInfo);

/**
 * Admin-exclusive routes. The functions called are the same and must have different behaviors depending on the route.
 */
router.get('/users', getAllUsers);
router.delete('/user', deleteUser);
router.post('/service', createService);
router.patch('/service/:name', updateService);
router.delete('/service/:name', deleteService);
router.get('/bookingInfos', getAllBookingInfos);


/**
 * Logout
 */
router.get('/logout', logout);

module.exports = router;