export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  password: string | null;
}
export interface Sessions {
  id: string;
  expires: string;
  sessionToken: string;
  userId: string | null;
}
export interface Account {
  id: string;
  type: string;
  provider: string;
  providerAccountId: string;

  userId: string | null;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  oauth_token_secret: string | null;
  oauth_token: string | null;
}
