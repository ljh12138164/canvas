import type { Session, User, UserMetadata } from '@supabase/supabase-js';
// export interface User {
//   id: string;
//   name: string;
//   image: string;
//   account: string;
//   created_at: string;
// }

// export interface UserQuery {
//   data: User | undefined;
//   isLoading: boolean;
//   error: Error | null;
// }
// 用户图片
export interface UserImage {
  id: string;
  imageId: string;
  url: string;
}
// 用户信息
export interface Profiles {
  id: string;
  name: string;
  image: string;
  email: string;
}
// meta
export interface Meta {
  name: string;
  sub: string;
  image: string;
  email: string;
}

export type Sessions = {
  user: User & {
    user_metadata: UserMetadata & Meta;
  };
  session: Session;
};
