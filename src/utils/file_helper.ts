export const fileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new Error('Only image and video files are allowed!'),
      false,
    );
  }

  callback(null, true);
};
