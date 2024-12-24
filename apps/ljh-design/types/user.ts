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
export interface UserImage {
  id: string;
  imageId: string;
  url: string;
}

export type Sessions = {
  user: User & {
    user_metadata: UserMetadata;
  };
  session: Session;
};
