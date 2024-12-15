<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
const image = ref<string | null>(null)
const filetype = ref<string | null>(null)
const files = ref<File | null>(null)
const handleChange = (e: Event) => {
  const file = e.target?.files?.[0]
  const reader = new FileReader()
  files.value = file
  filetype.value = file?.type
  reader.readAsDataURL(file)
  reader.onload = () => {
    image.value = reader.result as string
  }
  if (file) {
    console.log(file)
  }
  e.target.value = ''
}

const handleUpload = () => {
  console.log('上传')
  console.log(image.value)
  const formData = new FormData()
  formData.append('image', image.value as string)
  formData.append('filetype', filetype.value as string)
  formData.append('prompt', '解释这张图片')
  console.log(formData.get('image'))
  fetch('https://www.ljhboard.cn/api/ai/image/file', {
    method: 'POST',
    body: formData,
  })
}
</script>
<template>
  <img v-if="image" :src="image" />
  <input type="file" @change="handleChange" />
  <Button @click="handleUpload">上传</Button>
</template>

<style scoped></style>
