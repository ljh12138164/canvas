export interface Template {
  id: string;
  json: string;
  image: string;
  sort: number;
  name: string;
  description: string;
}

export interface Material {
  id: string;
  created_at: string;
  options: string;
  userId: string;
  name: string;
  clone: boolean;
}
