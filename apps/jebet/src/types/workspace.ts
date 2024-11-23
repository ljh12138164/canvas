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
}
