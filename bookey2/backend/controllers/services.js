const Service = require('../models/Service.js');
const { verifyAuth } = require("./utils.js");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const simpleAuth = verifyAuth(req, res, { authType: "Simple" });
    if(!simpleAuth.authorized) {
        res.status(401).json(simpleAuth.message);
        return;
    }

    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single service by ID
exports.getServiceByName = async (req, res) => {
  const name = req.params.name;
  try {
    const simpleAuth = verifyAuth(req, res, { authType: "Simple" });
    if(!simpleAuth.authorized) {
        res.status(401).json(simpleAuth.message);
        return;
    }

    const service = await Service.findOne({ where: { Name: name } });

    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new service (requires admin role)
exports.createService = async (req, res) => {

  const { name, location, timestamp, youtubeUrl, instagramUrl, twitterUrl, facebookUrl, coordinates } = req.body;

  try {
    const userAuth = verifyAuth(req, res, { authType: "Admin" });
    if(!userAuth.authorized) {
        res.status(401).json(userAuth.message);
        return;
    }

    const newService = await Service.create({
      Name: name,
      Location: location,
      Timestamp: timestamp,
      Youtube_URL: youtubeUrl,
      Instagram_URL: instagramUrl,
      Twitter_URL: twitterUrl,
      Facebook_URL: facebookUrl,
      Coordinates: coordinates
    });
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a service by ID (requires admin role)
exports.updateService = async (req, res) => {

  const updateServiceName = req.params.name;
  const { name, location, timestamp, youtubeUrl, instagramUrl, twitterUrl, facebookUrl, coordinates } = req.body;

  try {
    const userAuth = verifyAuth(req, res, { authType: "Admin" });
    if(!userAuth.authorized) {
        res.status(401).json(userAuth.message);
        return;
    }

    const service = await Service.findOne({ where: { Name: updateServiceName } });
    if (service) {
      await service.update({
        Name: name,
        Location: location,
        Timestamp: timestamp,
        Youtube_URL: youtubeUrl,
        Instagram_URL: instagramUrl,
        Twitter_URL: twitterUrl,
        Facebook_URL: facebookUrl,
        Coordinates: coordinates
      });
      res.status(200).json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a service by ID (requires admin role)
exports.deleteService = async (req, res) => {

  const name = req.params.name;

  try {
    const userAuth = verifyAuth(req, res, { authType: "Admin" });
    if(!userAuth.authorized) {
        res.status(401).json(userAuth.message);
        return;
    }

    const result = await Service.destroy({ where: { Name: name } });

    if (result === 1) {
      res.status(200).json({ message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
