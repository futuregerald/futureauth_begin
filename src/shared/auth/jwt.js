const add = require('date-fns/add');
const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../DB/RefreshTokenModel');

// const getExpDate = () => Math.floor(Date.now() / 1000) + 60 * 60;
const getExpDate = options => {
  let expiryOptions = options;
  if (!expiryOptions) {
    expiryOptions = { hours: 1 };
  }
  const expiryDate = add(new Date(), expiryOptions);
  return Math.floor(expiryDate.getTime() / 1000);
};

const generateUserJWT = (signingSecret, options) =>
  jwt.sign(
    {
      exp: options.exp || getExpDate(),
      tenant: options.tenantID || 'global',
      app_metadata: {
        user_id: options._id,
        user_email: options.email,
        authorization: {
          roles: options.roles,
        },
        custom: options.appMetadata,
      },
      user_metadata: options.userMetadata,
    },
    signingSecret
  );

const generateRefreshJWT = (signingSecret, options) =>
  jwt.sign(
    {
      exp: options.exp || getExpDate({ months: 1 }),
      app_metadata: {
        user_id: options._id,
      },
    },
    signingSecret
  );

/**
 *
 * @param {string} signingSecret Secret used to sign the JWT
 * @param {object} options Options used to generate JWT
 * @param {object} user User contains user email, app and user metadata, roles, and tenant
 */
const generateAndSaveRefreshToken = async (signingSecret, options, user) => {
  try {
    const token = generateRefreshJWT(signingSecret, options);
    await RefreshTokenModel.create({ token, user });
    return token;
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 *
 * @param {string} token
 * @return {object} decodedToken is returned. shape depends on token payload
 */
const decodeJWT = token => jwt.decode(token);

exports.generateAndSaveRefreshToken = generateAndSaveRefreshToken;
exports.generateRefreshJWT = generateRefreshJWT;
exports.generateUserJWT = generateUserJWT;
exports.decodeJWT = decodeJWT;
