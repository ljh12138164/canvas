import { createApi } from 'unsplash-js';
//获取图片的api
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
  fetch,
});

export default unsplash;
