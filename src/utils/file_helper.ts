export const fileFilter = (req: any, file: any, callback: any) => {
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|mp4|x-matroska|x-msvideo|x-flv|3gpp)$/,
    )
  ) {
    return callback(
      new Error('Only image and video files are allowed!'),
      false,
    );
  }

  callback(null, true);
};

export const imageProfileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new Error('Only image and video files are allowed!'),
      false,
    );
  }

  callback(null, true);
};
