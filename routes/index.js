// Import the Express router and API routes
const router = require('express').Router();
const apiRoutes = require('./api');

// Assign the API routes to the '/api' path
router.use('/api', apiRoutes);

// Handle requests to undefined routes
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;
