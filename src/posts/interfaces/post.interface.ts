import * as mongoose from 'mongoose';

export interface PostI {
  _id?: string;
  images?: { url: string; key: string }[];
  detail?: string;
  author?: mongoose.Types.ObjectId;
  __v?: number;
}
