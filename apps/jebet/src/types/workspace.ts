export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_t: string;
  imageUrl: string;
  inviteCode: string;
}

export interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  role: "admin" | "member";
  email: string;
  userImage: string;
  username: string;
  created_at: string;
}

export interface projects {
  created_at: string;
  updated_t: string;
  id: string;
  userId: string;
  workspaceId: string;
  imageUrl: string;
}
