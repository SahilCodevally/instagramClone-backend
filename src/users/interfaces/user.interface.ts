import * as mongoose from 'mongoose';

export interface User {
  _id?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  password?: string;
  bio?: string;
  profileImage?: string;
  followers?: mongoose.Schema.Types.ObjectId[];
  following?: mongoose.Schema.Types.ObjectId[];
  __v?: number;
}
