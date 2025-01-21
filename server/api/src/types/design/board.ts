export interface Board {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  json: string;
  height: number;
  url?: string;
  isTemplate?: boolean;
  width: number;
}

export interface BoardResponse extends Board {
  count: number;
}
