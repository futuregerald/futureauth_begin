const mongoose = require('mongoose');

const { Schema } = mongoose;

const RefreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    Tenant: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    createdAt: { type: Date, expires: '30d', default: Date.now },
  },
  { timestamps: true }
);

RefreshTokenSchema.pre('save', async function(next) {
  const token = this;
  const RefreshToken = this.constructor;
  if (!this.isModified('token')) {
    return next();
  }

  try {
    await RefreshToken.deleteMany({ user: token.user });
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }

  next();
});

const RefreshTokenModel = mongoose.model('RefreshToken', RefreshTokenSchema);
module.exports = RefreshTokenModel;
