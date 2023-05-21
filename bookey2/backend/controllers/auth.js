const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
// import { verifyAuth } from './utils.js';

/**
 * Register a new user in the system
  - Request Body Content: An object having attributes `username`, `email` and `password`
  - Response `data` Content: A message confirming successful insertion
  - Optional behavior:
    - error 400 is returned if there is already a user with the same username and/or email
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser) return res.status(400).json({ message: "You are already registered" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            Name: name,
            Email: email,
            Password: hashedPassword,
        });
        res.status(200).json('User added succesfully');
    } catch (err) {
        res.status(400).json(err);
    }
};

/**
 * Register a new user in the system with an Admin role
  - Request Body Content: An object having attributes `username`, `email` and `password`
  - Response `data` Content: A message confirming successful insertion
  - Optional behavior:
    - error 400 is returned if there is already a user with the same username and/or email
 */
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser) return res.status(400).json({ message: "You are already registered" });
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            Name: name,
            Email: email,
            Password: hashedPassword,
            isAdmin: true
        });
        res.status(200).json('Admin added succesfully');
    } catch (err) {
        res.status(500).json(err);
    }

}

/**
 * Perform login 
  - Request Body Content: An object having attributes `email` and `password`
  - Response `data` Content: An object with the created accessToken and refreshToken
  - Optional behavior:
    - error 400 is returned if the user does not exist
    - error 400 is returned if the supplied password does not match with the one in the database
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const cookie = req.cookies;
    const existingUser = await User.findOne({ where: { Email: email } });
    if (!existingUser) return res.status(400).json('You need to register first');
    try {
        const match = await bcrypt.compare(password, existingUser.Password);
        if (!match) return res.status(400).json('Invalid Credentials');
        //CREATE ACCESSTOKEN
        const accessToken = jwt.sign({
            Email: existingUser.Email,
            User_ID: existingUser.User_ID,
            Name: existingUser.Name,
            isAdmin: existingUser.isAdmin
        }, process.env.ACCESS_KEY, { expiresIn: '1h' });
        //CREATE REFRESH TOKEN
        const refreshToken = jwt.sign({
            Email: existingUser.Email,
            User_ID: existingUser.User_ID,
            Name: existingUser.Name,
            isAdmin: existingUser.isAdmin
        }, process.env.ACCESS_KEY, { expiresIn: '7d' });
        //SAVE REFRESH TOKEN TO DB
        existingUser.Refresh_Token = refreshToken;
        const savedUser = await existingUser.save();
        res.cookie("accessToken", accessToken, { httpOnly: true, domain: process.env.DOMAIN, path: process.env.PATH, maxAge: 60 * 60 * 1000, sameSite: "none", secure: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, domain: process.env.DOMAIN, path: process.env.PATH, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true });
        res.status(200).json({ data: { accessToken: accessToken, refreshToken: refreshToken } });
    } catch (error) {
        res.status(400).json(error);
    }
}

/**
 * Perform logout
  - Auth type: Simple
  - Request Body Content: None
  - Response `data` Content: A message confirming successful logout
  - Optional behavior:
    - error 400 is returned if the user does not exist
 */
exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("Hello: " + refreshToken);
    if (!refreshToken) return res.status(400).json("User not found");
    const user = await User.findOne({ Refresh_Token: refreshToken });
    if (!user) return res.status(400).json("User not found");
    try {
        user.Refresh_Token = null;
        res.cookie("accessToken", "", { httpOnly: true, path: process.env.PATH, maxAge: 0, sameSite: 'none', secure: true });
        res.cookie('refreshToken', "", { httpOnly: true, path: process.env.PATH, maxAge: 0, sameSite: 'none', secure: true });
        const savedUser = await user.save();
        res.status(200).json('Logged Out');
    } catch (error) {
        res.status(400).json(error);
    }
}
