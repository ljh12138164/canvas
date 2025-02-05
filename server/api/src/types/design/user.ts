export interface User {
  id: string;
  name: string;
  image?: string;
  account: string;
  created_at: string;
}

export interface UserQuery {
  data: User | undefined;
  isLoading: boolean;
  error: Error | null;
}

export interface UserImage {
  id: string;
  userId: string;
  url: string;
  created_at: string;
  star: boolean;
}
