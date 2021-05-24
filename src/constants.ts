export const model = {
  user: 'USER',
  post: 'POST',
};

export const CODE = {
  success: 200,
  created: 201,
  forbidden: 403,
  badRequest: 400,
  dataNotFound: 404,
  unauthorized: 401,
  internalServer: 500,
};

export const MESSAGE = {
  success: 'Success',
  userNotFound: 'User not found!',
  loginSuccess: 'Login successful',
  followed: 'Successfully followed',
  uploadFailed: 'File uploading filed',
  unfollowed: 'Successfully unfollowed',
  postCreated: 'Post created successfully',
  createPostFailed: 'Error while creating post',
  profileUpdated: 'Profile updated successfully',
  invalidDetails: 'Please provide valid details.',
  addFollowingError: 'Error while following user',
  userUpdatedSuccess: 'User updated successfully',
  loginError: 'Please enter valid email or password',
  profileImage: 'Profile image updated successfully',
  removeFollowingError: 'Error while unfollowing user',
  addFollowerError: 'Error while adding follower user',
  profileImageError: 'Error while uploading profile image',
  profileImageRemoved: 'Profile image removed successfully',
  removeProfileImageError: 'Error while removing profile image',
  invalidCredentials: 'Please provide valid credentials and try again',
  socialAccAddSuccess: 'Your social account has been added successfully',
  internalServerError: 'Internal server error. Please try after some time.',
};

export const VALIDATION = {
  images: 'Please select image!',
  email: 'Please provide Email!',
  password: 'Please provide Password!',
  emailTaken: 'Another account is using',
  validEmail: 'Please provide valid Email!',
  fullName: 'Please provide valid Fullname!',
  userName: 'Please provide valid Username!',
  invalidPassword: 'Please provide valid password!',
  validPassword: 'Password must contains 5 characters!',
  invalidEmailId: "Account doesn't exists with this email id",
  tokenNotProvided: 'Please provide a valid authorization details',
  userNameTaken: "This username isn't available. Please try another.",
};

export const emailRegex = /\b[a-z0-9-_.]+@[a-z0-9-_.]+(\.[a-z0-9]+)+/i;
