/* eslint-disable import/no-extraneous-dependencies */

const { loginEmailPassword } = require('@architect/shared/auth/auth');
require('@architect/shared/DB/dbConnection');
const arc = require('@architect/functions');
const validatePayload = require('./validator');

const headers = {
  'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
  'content-type': 'application/json',
};

exports.handler = async function http(req) {
  try {
    /**
     * @type {{username: string, password: string, tenant: string}}
     */
    const body = JSON.parse(req.body);
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
};
