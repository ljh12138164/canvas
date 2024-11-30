import { Session } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { ref } from "vue";

const useUser = defineStore("user", () => {
  // 为了完整类型推理，推荐使用箭头函数
  const userData = ref<{
    session: Session;
  } | null>(null);
  console.log(userData);
  const setUserData = (data: { session: Session }) => (userData.value = data);

  return {
    userData,
    setUserData,
  };
});

export default useUser;
