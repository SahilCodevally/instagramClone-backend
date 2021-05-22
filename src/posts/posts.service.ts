import { Injectable } from '@nestjs/common';
import { PostI } from './interfaces/post.interface';
import { S3COS as IBMCloud } from '../utils/ibm_cloud';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const cloud = new IBMCloud();
import * as mongoose from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel('Post') private readonly postModel: Model<PostI>) {}

  // Upload file
  async uploadFile(images: any[]): Promise<{ url: string; key: string }[]> {
    return new Promise((resolveUploads, rejectUploads) => {
      const promises = [];

      for (const image of images) {
        promises.push(
          new Promise((resolve, reject) => {
            cloud
              .createObjectInBucket(image)
              .then((response) => resolve(response))
              .catch((err) => {
                console.log({ err });
                reject(err);
              });
          }),
        );
      }

      Promise.all(promises)
        .then((results) => {
          return resolveUploads(results);
        })
        .catch((err) => {
          console.log(err);
          return rejectUploads(err);
        });
    });
  }

  // Create new post
  async createPost(postData: PostI): Promise<PostI> {
    const post = new this.postModel(postData);
    return await post.save();
  }

  // Get all post
  async getAllPost(id: mongoose.Schema.Types.ObjectId): Promise<PostI[]> {
    return await this.postModel.find({ author: id });
  }
}
