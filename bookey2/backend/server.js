const { app, port } = require('./app.js');
const { dbConnection, sequelize } = require('./db/connection');

const startServer = async () => {
  try {
    // Connect to MySQL database using mysql2
    dbConnection.connect((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Connected to MySQL database');
      }
    });

    // Sync Sequelize models with the database
    await sequelize.sync();

    // Start the server
    app.listen(port, () => {
      console.log(`App listening on port ${port}!`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
