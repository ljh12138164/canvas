import type { FormItem } from '@/types/form'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type FormType = 'name' | 'type' | 'label' | 'isRequired' | 'placeholder' | 'defaultValue'

export const useForm = defineStore('form', () => {
  const list2 = ref<FormItem[]>([])
  const listComputed = computed(() => list2.value)
  //   初始化赋值
  const setList2 = (list: FormItem[]) => (list2.value = list)
  // 添加
  const pushList2 = (item: FormItem) => (list2.value = [...list2.value, item])
  // 删除
  const deleteList2 = (id: string) => (list2.value = list2.value.filter((item) => item.id !== id))
  // 更新
  const updateList2 = (id: string, type: FormType, newValue: string | boolean) => {
    list2.value = list2.value.map((item) => {
      if (item.id === id) {
        ;(item as any)[type] = newValue
      }
      return item
    })
  }
  return {
    list2,
    listComputed,
    setList2,
    pushList2,
    deleteList2,
    updateList2,
  }
})
