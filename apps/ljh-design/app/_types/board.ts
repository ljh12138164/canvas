export interface Board {
  id: string;
  name?: string;
  created_at?: string;
  updated_at: string;
  json: string;
  width: number | string;
  height: number | string;
  url?: string;
  image?: string;
  isTemplate?: boolean;
}

export interface BoardResponse extends Board {
  count: number;
}
export interface BoardData {
  id: string;
  name?: string;
  created_at?: string;
  updated_at: string;
  json: string;
  width: number;
  height: number;
  url?: string;
  isTemplate?: boolean;
}
