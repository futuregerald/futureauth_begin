/* eslint-disable import/no-extraneous-dependencies */

const { signupEmailPassword } = require('@architect/shared/auth/auth');
require('@architect/shared/DB/dbConnection');
const arc = require('@architect/functions');
const validatePayload = require('./validator');

const headers = {
  'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
  'content-type': 'application/json',
};

exports.handler = async function http(req) {
  try {
    const body = JSON.parse(req.body);
    validatePayload(body);

    const results = await signupEmailPassword(body);

    await arc.events.publish({
      name: 'account-new-signup',
      payload: results.user,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: error.message,
    };
  }
};
