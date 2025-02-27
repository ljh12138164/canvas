export interface Workspace {
  title: string;
  userId: string;
  inconId: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  data?: string;
  inviteCode?: string;
  inTrash?: boolean;
  logo?: string;
  bannerUrl?: string;
}

export interface Folders extends Workspace {
  workspaceId: string;
}

export interface Files extends Folders {
  foldId: string;
}

export interface Collaborators {
  workspaceId: string;
  userId: string;
  created_at: string;
}
