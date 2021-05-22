import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  signup(): string {
    return 'Signup from service';
  }

  login(): string {
    return 'Login from service';
  }

  async getAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  // Get user details method
  async getUserDetails(query: {
    email?: string;
    userName?: string;
  }): Promise<User> {
    return await this.userModel.findOne(query).lean();
  }

  async findUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
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
}
