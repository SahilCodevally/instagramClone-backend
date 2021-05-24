import moment from 'moment';

export const postTimeChange = (posts: any[]) => {
  posts.forEach((post: any) => {
    const time = moment(post.createdAt).fromNow(true);
    if (time === 'a day') {
      post.createdTime = moment(post.createdAt).format('LLL');
      post.updatedTime = moment(post.updatedAt).format('LLL');
    } else {
      post.createdTime = time;
      post.updatedTime = moment(post.updatedAt).fromNow(true);
    }
  });
  return posts;
};
