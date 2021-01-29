const mongoose = require('mongoose');

const { Schema } = mongoose;
const argon2 = require('argon2');

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: false,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    appMetadata: {
      type: Object,
      default: {},
    },
    userMetadata: {
      type: Object,
      default: {},
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    roles: {
      type: Array,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function(next) {
  const user = this;
  if (!this.isModified('password')) {
    return next();
  }
  let hash;

  try {
    hash = await argon2.hash(user.password, { type: argon2.argon2id });
  } catch (err) {
    console.log(err);
    user.password = '';
  }

  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function(password) {
  try {
    const user = this;
    const compare = await argon2.verify(user.password, password);
    console.log('comparing password: ', compare);
    console.log(typeof compare);
    return compare;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
