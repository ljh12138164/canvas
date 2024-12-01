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

export interface Filts extends Folders {
  folderId: string;
}
// 协作
export interface Collaborators {
  workspaceId: string;
  userId: string;
  created_at: string;
}
