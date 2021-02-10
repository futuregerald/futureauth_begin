/* eslint-disable import/no-extraneous-dependencies */

const { signupEmailPassword } = require('@architect/shared/auth/auth');
const { headers } = require('@architect/shared/common/headers');
require('@architect/shared/DB/dbConnection');
const arc = require('@architect/functions');
const validatePayload = require('./validator');

async function http(req) {
  console.log(req);
  try {
    const { body } = req;

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
}

exports.handler = arc.http.async(validatePayload, http);
