import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
interface ActiveUser {
  name: string;
  id: string;
  color: string;
  image: string;
}

export const useActiveUserStore = defineStore('activeUser', () => {
  const activeUserList = ref<Map<string, ActiveUser>>(new Map());
  const getActiveUserList = computed(() => {
    return activeUserList.value;
  });
  const setActiveUserList = (user: ActiveUser[]) => {
    activeUserList.value.clear();
    if (user.length === 0) return;
    user.forEach((item) => {
      activeUserList.value.set(item.id, item);
    });
  };
  const removeActiveUser = (user: ActiveUser) => {
    activeUserList.value.delete(user.id);
  };
  return {
    activeUserList,
    getActiveUserList,
    setActiveUserList,
    removeActiveUser,
  };
});
