const express = require('express');
const app = express();
const PDFRoutes = require('./api/route/pdf-routes');
const Validation = require('./api/config/validation');

const PORT = process.env.PORT || 8080;

app.use('/pdf', PDFRoutes);

Validation.validateRequirements();

const server = app.listen(PORT, function () {
  console.log('Example app listening on port ' + PORT + '!');
});