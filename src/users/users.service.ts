import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { S3COS as IBMCloud } from 'src/utils/ibm_cloud';
const cloud = new IBMCloud();

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  // Get user details method
  async getUserDetails(query: {
    email?: string;
    userName?: string;
    _id?: string;
  }): Promise<User> {
    return await this.userModel.findOne(query).lean();
  }

  async findUserById(id: string): Promise<any> {
    return await this.userModel.findById(id).lean();
  }

  // Create new user method
  async createUser(userData: User): Promise<User> {
    const user = new this.userModel(userData);
    return await user.save();
  }

  // Add following
  async addFollowing(id: string, followingTo: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, {
      $push: { following: followingTo },
    });
  }

  // Add follower
  async addFollower(id: string, follower: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, {
      $push: { followers: follower },
    });
  }

  // Remove following
  async removeFollowing(id: string, unfollowTo: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, {
      $pull: { following: unfollowTo },
    });
  }

  // Remove follower
  async removeFollower(id: string, unfollower: string): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, {
      $pull: { followers: unfollower },
    });
  }

  // Update profile image
  async uploadImage(profileImage: any): Promise<{ url: string; key: string }> {
    return await cloud.createObjectInBucket(profileImage);
  }

  // Update user
  async updateUser(userId: string, query: any): Promise<User> {
    return await this.userModel.findByIdAndUpdate(userId, query);
  }

  // Remove profile image
  async deleteProfileImage(profileImage: {
    url: string;
    key: string;
  }): Promise<any> {
    return await cloud.deleteObject(profileImage.key);
  }
}
