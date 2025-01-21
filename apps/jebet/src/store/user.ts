import type { Member, Project, Workspace } from '@/types/workspace';
import type { UserResource } from '@clerk/types';
import { makeAutoObservable } from 'mobx';
class UserStore {
  userData: UserResource | null = null;
  workspace: (Workspace & { member: Member[] })[] | null = null;
  project: Project[] | null = null;
  activeWorkSpace: Workspace | null = null;
  activeProject: Project | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  setWorkspace(workspace: (Workspace & { member: Member[] })[]) {
    this.workspace = workspace;
  }
  setUserData(userData: UserResource) {
    this.userData = userData;
  }
  setProject(project: Project[]) {
    this.project = project;
  }
  setActiveWorkSpace(workspace: (Workspace & { member: Member[] }) | null) {
    if (workspace) {
      this.activeWorkSpace = workspace;
    }
  }
  setActiveProject(project: Project | null) {
    if (project) {
      this.activeProject = project;
    }
  }
}

export default new UserStore();
