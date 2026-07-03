'use strict';

// Standalone local server. On Vercel, api/server.js is invoked as a serverless
// function instead. Loads .env, then starts the exported Fastify instance.
require('dotenv').config();

const { fastify } = require('./api/server');

const port = Number(process.env.PORT) || 3001;

fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Subhedar Salary Generator API listening at ${address}`);
});
