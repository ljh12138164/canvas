export interface Workspace {
  title: string;
  userId: string;
  inconId: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  data?: string;
  inTrash?: boolean;
  logo?: string;
  inviteCode?: string;
  bannerUrl?: string;
}

export interface Folders extends Workspace {
  workspaceId: string;
  files?: Filts[];
}

export interface Filts extends Folders {
  foldId: string;
}
// 协作
export interface Collaborators {
  workspaceId: string;
  userId: string;
  created_at: string;
}

export interface Profiles {
  id: string;
  name: string;
  image: string;
  email: string;
}
