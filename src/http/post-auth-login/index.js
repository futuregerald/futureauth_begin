/* eslint-disable import/no-extraneous-dependencies */

const { loginEmailPassword } = require('@architect/shared/auth/auth');
const { headers } = require('@architect/shared/common/headers');
require('@architect/shared/DB/dbConnection');
const arc = require('@architect/functions');
const validatePayload = require('./validator');

async function http(req) {
  console.log('req', req);
  try {
    /**
     * @type {{username: string, password: string, tenant: string}}
     */
    const { body } = req;
    validatePayload(body);

    const results = await loginEmailPassword(body);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: error.message,
    };
  }
}

exports.handler = arc.http.async(http);
