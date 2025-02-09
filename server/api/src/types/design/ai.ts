export type Ai = {
  id: string;
  name: string;
  userId: string;
  created_at: string;
  updated_at: string;
  history: {
    role: 'user' | 'model';
    imagePrompt?: string;
    parts: { text: string }[];
    type: 'text' | 'image';
  }[];
};
