const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Get-Er-Done API',
      version: '1.0.0',
      description:
        'A task management REST API built with Express.js and MongoDB. ' +
        'Provides full CRUD operations for tasks.',
      contact: {
        name: 'Get-Er-Done',
        url: 'https://github.com/mrsCandyBar/get-er-done-BE',
      },
    },
    servers: [
      {
        url: 'http://localhost:{port}',
        description: 'Local development server',
        variables: {
          port: {
            default: process.env.PORT || '3000',
          },
        },
      },
    ],
  },
  apis: ['./routes/*.js', './docs/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
