import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    userName: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    bio: { type: String },
    profileImage: {
      url: { type: String },
      key: { type: String },
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  },
);
