import type { Sessions } from '@/types/user'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useUser = defineStore('user', () => {
  const isLoading = ref(true)
  const setIsLoading = (value: boolean) => (isLoading.value = value)
  // 为了完整类型推理，推荐使用箭头函数
  const user = ref<{
    session: Sessions
  } | null>(null)
  const setUserData = (data: { session: Sessions }) => (user.value = data)

  const userData = computed(() => user.value)
  const initLoading = computed(() => isLoading.value)
  return {
    userData,
    setUserData,
    // 初始化
    setIsLoading,
    initLoading,
  }
})

export default useUser
