import { Workspace, Project } from '@/types/workspace';
import { UserResource } from '@clerk/types';
import { makeAutoObservable } from 'mobx';
class UserStore {
  userData: UserResource | null = null;
  workspace: Workspace[] | null = null;
  project: Project[] | null = null;
  activeWorkSpace: Workspace | null = null;
  activeProject: Project | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  setWorkspace(workspace: Workspace[]) {
    this.workspace = workspace;
  }
  setUserData(userData: UserResource) {
    this.userData = userData;
  }
  setProject(project: Project[]) {
    this.project = project;
  }
  setActiveWorkSpace(workspace: Workspace | null) {
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
