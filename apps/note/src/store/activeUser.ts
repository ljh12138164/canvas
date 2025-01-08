import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
interface ActiveUser {
  name: string;
  id: string;
  color: string;
}

export const useActiveUserStore = defineStore('activeUser', () => {
  const activeUserList = ref<Set<ActiveUser>>(new Set());
  const getActiveUserList = computed(() => {
    return activeUserList.value;
  });
  const setActiveUserList = (user: ActiveUser) => {
    activeUserList.value.add(user);
  };
  const removeActiveUser = (user: ActiveUser) => {
    activeUserList.value.delete(user);
  };
  return {
    activeUserList,
    getActiveUserList,
    setActiveUserList,
    removeActiveUser,
  };
});
