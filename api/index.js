const express = require('express');
const serverless = require('serverless-http');
const path = require('path');

const app = express();

// Redirect to main app
module.exports = (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'API endpoint is working. Please use the main application.'
  });
};
