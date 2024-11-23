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
}

export interface WorkspaceWithMember extends Workspace {
  userId: string;
  role: "admin" | "member";
}
