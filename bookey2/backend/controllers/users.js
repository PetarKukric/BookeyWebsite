const User = require('../models/User.js');
const { verifyAuth } = require("./utils.js");

/**
 * Return all the users
  - Request Body Content: None
  - Response `data` Content: An array of objects, each one having attributes `username`, `email` and `role`
  - Optional behavior:
    - empty array is returned if there are no users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const userAuth = verifyAuth(req, res, { authType: "Admin" });
        if(!userAuth.authorized) {
            res.status(401).json(userAuth.message);
            return;
        }

        const users = await User.findAll();
        let filter = users.map(u => Object.assign({}, { Name: u.Name, Email: u.Email, isAdmin: u.isAdmin}));

        res.status(200).json(filter);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * Return information of a specific user
     - Request Body Content: None
    - Response `data` Content: An object having attributes `username`, `email` and `role`.
    - Optional behavior:
    - error 401 is returned if the user is not found in the system
    */
exports.getUserByEmail = async (req, res) => {
    try {
        const userAuth = verifyAuth(req, res, {authType: "User", Email: req.body.email});

        if(!userAuth.authorized){
            res.status(401).json({message: userAuth.message});
            return;
        }

        const user = await User.findOne({ where: { Email: req.body.email } });
        if (!user) return res.status(400).json({ message: "User not found" });

        let filter = { Name: user.Name, Email: user.Email, isAdmin: user.isAdmin };

        res.status(200).json(filter)
    } catch (error) {
        res.status(500).json(error.message)
    }
}

/**
 * Delete a user
  - Request Parameters: None
  - Request Body Content: A string equal to the `email` of the user to be deleted
  - Response `data` Content: An object having an attribute that lists the number of `deletedTransactions` and a boolean attribute that
    specifies whether the user was also `deletedFromGroup` or not.
  - Optional behavior:
    - error 401 is returned if the user does not exist 
 */
exports.deleteUser = async (req, res) => {
    try {

      if(!verifyAuth(req,res,{authType: "Admin"}).authorized){
        return;
      }

      const email = req.body.email;

      const result = User.destroy({ where: { Email: email } });

      if (result === 1) {
        return res.status(200).json({ message: 'User deleted successfully' });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
      
    } catch (err) {
        res.status(500).json(err.message)
    }
}