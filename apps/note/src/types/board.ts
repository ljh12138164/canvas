export interface Workspace {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  workspaceOwners: string;
  inconId: string;
  data?: string;
  inTrash?: boolean;
  logo?: string;
  bannerUrl?: string;
}

export interface Folders extends Workspace {
  workspaceId: string;
}

export interface Files extends Folders {
  folderId: string;
}

export interface Collaborators {
  workspaceId: string;
  userId: string;
  created_at: string;
}
