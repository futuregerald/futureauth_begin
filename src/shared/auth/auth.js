const { userSerializer } = require('../serializers/user');
const UserModel = require('../DB/UserModel');
const TenantModel = require('../DB/TenantModel');

const { generateUserJWT, generateAndSaveRefreshToken } = require('./jwt');

const signingSecret = process.env.SIGNING_SECRET;

exports.signupEmailPassword = async ({ email, password }) => {
  try {
    if (!signingSecret) {
      throw new Error('JWT Signing Secret Not Found');
    }
    const user = await UserModel.create({ email, password });
    const userObj = user;

    const userJwtOptions = {
      _id: userObj._id,
      email: userObj.email,
      appMetadata: userObj.appMetadata,
      userMetadata: userObj.userMetadata,
      roles: userObj.roles,
    };

    return {
      user: userSerializer(userObj),
      jwt: generateUserJWT(signingSecret, userJwtOptions),
      refreshToken: await generateAndSaveRefreshToken(
        signingSecret,
        userJwtOptions,
        user
      ),
    };
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
/**
 *
 * @param {object} authInfo Authentication infor required to login
 * @param {string} authInfo.email Email of user
 * @param {string} authInfo.password unencrypted user password
 * @param {string} authInfo.tenant Tenant ID to get signing secret
 * @return {{user: object, jwt: string, refreshToken: string}}
 *
 */
exports.loginEmailPassword = async ({ email, password, tenantID }) => {
  try {
    let tenantSigningSecret;
    if (tenantID) {
      const { signingSecret: secret } = await TenantModel.findById(tenantID);
      tenantSigningSecret = secret;
    }
    if (!signingSecret) {
      throw new Error('JWT Signing Secret Not Found');
    }
    const user = await UserModel.findOne({ email });
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      console.log('invalid password bruv');
      throw new Error('Authentication Failure');
    }
    const userObj = user;

    const userJwtOptions = {
      _id: userObj._id,
      email: userObj.email,
      appMetadata: userObj.appMetadata,
      userMetadata: userObj.userMetadata,
      roles: userObj.roles,
    };

    return {
      user: userSerializer(userObj),
      jwt: generateUserJWT(
        tenantSigningSecret || signingSecret,
        userJwtOptions
      ),
      refreshToken: await generateAndSaveRefreshToken(
        signingSecret,
        userJwtOptions,
        user
      ),
    };
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

/**
 *
 * @param {object} verifyObj
 * @param {string} verifyObj.token User JWT token to be verified
 *
 */
exports.verifyAccessToken = async ({ token, tenantID, email, password }) => {
  try {
    let tenantSigningSecret;
    if (tenantID) {
      const { signingSecret: secret } = await TenantModel.findById(tenantID);
      tenantSigningSecret = secret;
    }
    if (!signingSecret) {
      throw new Error('JWT Signing Secret Not Found');
    }
    const user = await UserModel.findOne({ email });
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      console.log('invalid password bruv');
      throw new Error('Authentication Failure');
    }
    const userObj = user;

    const userJwtOptions = {
      _id: userObj._id,
      email: userObj.email,
      appMetadata: userObj.appMetadata,
      userMetadata: userObj.userMetadata,
      roles: userObj.roles,
    };

    return {
      user: userSerializer(userObj),
      jwt: generateUserJWT(
        tenantSigningSecret || signingSecret,
        userJwtOptions
      ),
      refreshToken: await generateAndSaveRefreshToken(
        signingSecret,
        userJwtOptions,
        user
      ),
    };
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
