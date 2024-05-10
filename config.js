// Import the necessary modules
require('dotenv').config();

// Configuration object
const config = {
    authentication: {
        options: {
            userName: process.env.DB_USER, // Get the database username from environment variables
            password: process.env.DB_PASSWORD // Get the database password from environment variables
        },
        type: 'default'
    },
    server: process.env.DB_SERVER, // Get the database server name from environment variables
    options: {
        database: process.env.DB_NAME, // Get the database name from environment variables
        encrypt: true
    }
};

// Export the configuration object
module.exports = config;
