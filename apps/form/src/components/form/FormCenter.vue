<script lang="ts" setup>
import { ref } from 'vue'

const el2 = ref()
const props = defineProps<{
  list: { id: string; name: string }[]
}>()
const activeArea = ref('')
const emit = defineEmits(['handleActiveArea'])
const handleActiveArea = (id: string) => {
  emit('handleActiveArea', id)
}
</script>
<template>
  <div
    v-for="item in props.list"
    :key="item.id"
    @click="handleActiveArea(item.id)"
    class="cursor-move h-50px rounded p-3"
    :class="{ 'bg-gray-500/5': activeArea === item.id }"
  >
    {{ item.name }}
  </div>
</template>
