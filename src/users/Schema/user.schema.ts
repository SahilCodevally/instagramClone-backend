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
    profileImage: String,
    bio: String,
  },
  {
    timestamps: true,
  },
);
