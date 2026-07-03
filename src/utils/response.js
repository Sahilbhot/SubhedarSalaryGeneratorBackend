'use strict';

// Consistent response envelope used by every route:
//   success → { success: true, data }
//   failure → { success: false, error }

function sendSuccess(reply, data, statusCode = 200) {
  return reply.code(statusCode).send({ success: true, data });
}

function sendError(reply, error, statusCode = 500) {
  const message = typeof error === 'string' ? error : error?.message || 'Internal Server Error';
  return reply.code(statusCode).send({ success: false, error: message });
}

module.exports = { sendSuccess, sendError };
