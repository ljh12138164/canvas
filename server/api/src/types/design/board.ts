export interface Board {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  json: string;
  height: number;
  image: string;
  url?: string;
  isTemplate?: boolean;
  width: number;
  userId: string;
}

export interface BoardResponse extends Board {
  count: number;
}
