// Import  'dotenv' to access variables in .env file
require("dotenv").config();

// Import 'sequelize'
const Sequelize = require("sequelize");

// Create a new connection to the database.
// If JAWSDB_URL environment variable is available (when deployed on Heroku), use it to connect.
// Otherwise, connect to the local MySQL database.
const sequelize = process.env.JAWSDB_URL
  ? // If application is deployed (ex. on Heroku) and JAWSDB_URL is available,
    // connect to the JawsDB database using the URL stored in the JAWSDB_URL environment variable
    new Sequelize(process.env.JAWSDB_URL)
  : // Otherwise, connect to the local MySQL database using the database name, username, and password stored
    new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: "localhost",
      dialect: "mysql",
      dialectOptions: {
        decimalNumbers: true,
      },
    });

// Export the 'sequelize' connection instance to be used in the application
module.exports = sequelize;
