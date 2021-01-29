const { uid } = require('rand-token');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const VerificationTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      default: uid(12),
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: { type: Date, expires: '1d', default: Date.now },
  },
  { timestamps: true }
);

const VerificationTokenModel = mongoose.model(
  'VerificationToken',
  VerificationTokenSchema
);
module.exports = VerificationTokenModel;
