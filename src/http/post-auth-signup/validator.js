const { Validator } = require('jsonschema');

const v = new Validator();

const validatePayload = body => {
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

  const validationResults = v.validate(body, schema, {
    allowUnknownAttributes: false,
  });
  if (validationResults.errors.length > 0) {
    throw new Error(JSON.stringify(validationResults.errors));
  }
};

module.exports = validatePayload;
