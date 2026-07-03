'use strict';

// Standalone local server. On Vercel, api/index.js is invoked as a serverless
// function instead. Both share the same app via src/app.js.
const buildApp = require('./src/app');
const env = require('./src/config/env');

const app = buildApp({ logger: true });

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`Subhedar Salary Generator API listening at ${address}`);
});
