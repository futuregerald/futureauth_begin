const { Validator } = require('jsonschema');

const headers = {
  'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
  'content-type': 'application/json',
};

const v = new Validator();

const validatePayload = req => {
  const { body } = req;
  const schema = {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      userMetadata: { type: 'object' },
      appMetadata: { type: 'object' },
      roles: { type: 'array' },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  };
  let validationResults;
  try {
    validationResults = v.validate(body, schema, {
      allowUnknownAttributes: false,
    });
  } catch (error) {
    console.log(error);
    return {
      statusCode: 422,
      headers,
      body: 'Unable to validate inbound body',
    };
  }

  if (validationResults.errors.length > 0) {
    let errorText = '';
    validationResults.errors.forEach(i => {
      errorText += `Request payload ${i.message}. `;
    });
    return {
      statusCode: 422,
      headers,
      body: errorText,
    };
  }
  req.isValidRequest = true;
};

module.exports = validatePayload;
