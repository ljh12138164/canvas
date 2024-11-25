export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  imageUrl: string;
  inviteCode: string;
}

export interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'admin' | 'member';
  email: string;
  userImage: string;
  username: string;
  created_at: string;
}

// 工作区成员
export interface WorkspaceWithMember extends Workspace {
  userId: string;
  role: 'admin' | 'member';
}

export interface Project {
  created_at: string;
  updated_at: string;
  id: string;
  userId: string;
  name: string;
  workspaceId: string;
  imageUrl: string;
}
