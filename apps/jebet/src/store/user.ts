import { Workspace } from "@/types/workspace";
import { UserResource } from "@clerk/types";
import { makeAutoObservable } from "mobx";
class UserStore {
  userData: UserResource | null = null;
  workspace: Workspace | null = null;
  constructor() {
    makeAutoObservable(this);
  }
}
const userStore = new UserStore();
export default userStore;
