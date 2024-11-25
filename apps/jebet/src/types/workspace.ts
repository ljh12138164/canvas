export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  imageUrl: string;
  inviteCode: string;
}

export interface Member {
  created_at: string;
  id: string;
  userId: string;
  workspaceId: string;
  role: "admin" | "member";
  email: string;
  userImage: string;
  username: string;
}

export interface Project {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  workspaceId: string;
  imageUrl: string;
}
