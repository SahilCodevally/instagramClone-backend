import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PostI } from './interfaces/post.interface';
import { S3COS as IBMCloud } from 'src/utils/ibm_cloud';
import { InjectModel } from '@nestjs/mongoose';
const cloud = new IBMCloud();

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post') private readonly postModel: mongoose.Model<PostI>,
  ) {}

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

  // Find author's post
  async postsByAuthor(autherId: mongoose.Types.ObjectId): Promise<PostI[]> {
    return await this.postModel.find({ author: autherId });
  }

  // Find all posts for feed page
  async posts(authors: mongoose.Types.ObjectId[]): Promise<PostI[]> {
    return await this.postModel
      .find({ author: { $in: authors } })
      .populate({
        path: 'author',
        select: ['_id', 'userName', 'profileImage', 'createdAt'],
      })
      .sort({ createdAt: -1 });
  }

  // Find post by id
  async post(postId: string): Promise<PostI> {
    return await this.postModel.findOne({ _id: postId });
  }

  // Delete post
  async deletePost(
    userId: mongoose.Types.ObjectId,
    postId: string,
  ): Promise<PostI> {
    return await this.postModel.findOneAndDelete({
      _id: postId,
      author: userId,
    });
  }

  // Delete posts images from cloud
  async deletePostImages(
    images: { url: string; key: string }[],
  ): Promise<any[]> {
    return new Promise((resolveAll, rejectAll) => {
      const promises = [];

      for (const image of images) {
        promises.push(
          new Promise((resolve, reject) => {
            cloud
              .deleteObject(image.key)
              .then((result) => resolve(result))
              .catch((err) => {
                console.log({ err });
                reject(err);
              });
          }),
        );
      }

      Promise.all(promises)
        .then((result) => {
          resolveAll(result);
        })
        .catch((err) => {
          rejectAll(err);
        });
    });
  }
}
