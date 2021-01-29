const pick = require('lodash/pick');
const omit = require('lodash/omit');
const cloneDeep = require('lodash/cloneDeep');

const userSerializer = u => {
  // you can use or not use both, or just one of the following two arrays to set which fields you want included in user object
  const allowedFields = ['email', 'appMetadata', 'userMetadata', 'roles']; // optional, put fields you want returned to the user
  const omittedFields = []; // optional, put fields you want ommitted, like 'password'

  let userObj = cloneDeep(u);
  if (allowedFields.length > 0) {
    userObj = pick(u, allowedFields);
  }
  if (omittedFields.length > 0) {
    userObj = omit(u, omittedFields);
  }
  return userObj;
};

exports.userSerializer = userSerializer;
