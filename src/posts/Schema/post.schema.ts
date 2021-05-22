import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema(
  {
    images: {
      type: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      require: true,
    },
    detail: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);
