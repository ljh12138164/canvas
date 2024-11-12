import { makeAutoObservable } from "mobx";

class AuthStore {
  userId = "";
  isLoading = true;
  constructor() {
    makeAutoObservable(this);
  }
  setUserId(userId: string) {
    this.userId = userId;
  }
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}
export const authStore = new AuthStore();
