var initializeSwagger = require('swagger-tools').initializeMiddleware;
var yaml = require('js-yaml');
var fs = require('fs');
var app = require('express')();

// This assumes you're in the root of the swagger-tools
try {
  var swaggerObject = yaml.safeLoad(fs.readFileSync('./swagger.yaml', 'utf8'));
} catch (e) {
  console.log(e);
}

// Configure non-Swagger related middleware and server components prior to Swagger middleware

// Initialize the Swagger middleware
initializeSwagger(swaggerObject, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.post('/example', function (req, res) {
    req.status(201).send({'name': 'test', 'age': 42, 'gender': 'male'});
  });

  app.use(function (err, req, res, next) {
    if (err && err.code)
      return res.status(400).send(err.results);
    next() 
  });

  // Start the server
  var serverPort = 3000;
  app.listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  });
});
