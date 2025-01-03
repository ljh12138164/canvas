// 模板分享
export interface Show {
  id: string;
  title: string;
  userId: string;
  created_at: string;
  updated_at?: string;
  explanation: string;
  relativeTheme: string;
}
// 收藏模板
export interface Collections {
  showId: string;
  userId: string;
  created_at: string;
  updated_at?: string;
}
// 点赞`
export interface Upvote {
  showId: string;
  userId: string;
  answerId: string;
  created_at: string;
  updated_at?: string;
}

// 标签
export interface Tag {
  showId: string;
  tag: string;
  userId: string;
  created_at: string;
  updated_at?: string;
}

// 评论
export interface Comment {
  showId: string;
  userId: string;
  answer: string;
  created_at: string;
  updated_at?: string;
}
