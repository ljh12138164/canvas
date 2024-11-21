import { Workspace } from "@/types/workspace";
import { UserResource } from "@clerk/types";
import { makeAutoObservable } from "mobx";
class UserStore {
  userData: UserResource | null = null;
  workspace: Workspace[] | null = null;
  activeWorkSpace: Workspace | null = null;
  constructor() {
    makeAutoObservable(this);
  }
  setWorkspace(workspace: Workspace[]) {
    this.workspace = workspace;
  }
  setUserData(userData: UserResource) {
    this.userData = userData;
  }
  setActiveWorkSpace(workspace: Workspace | null) {
    if (workspace) {
      this.activeWorkSpace = workspace;
    }
  }
}

export default new UserStore();
