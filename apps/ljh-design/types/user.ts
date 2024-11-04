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
