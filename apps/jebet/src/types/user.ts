import type { Session, User, UserMetadata } from '@supabase/supabase-js';

export interface UserMeta {
  email: string;
  email_verified: boolean;
  image: string;
  name: string;
  phone_verified: boolean;
  sub: string;
}
// export type Sessions = {
//   user: User & {
//     user_metadata: UserMeta;
//   };
// } & Session;

export interface Profiles {
  id: string;
  name: string;
  image: string;
  email: string;
}

export type Sessions = {
  user: User & {
    user_metadata: UserMetadata & Profiles;
  };
  session: Session;
};
