<script setup lang="ts">
import { getCurrentUser } from '@/server/supabase/user'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onBeforeMount(async () => {
  const user = await getCurrentUser()
  console.log(user)
  if (!user) {
    router.push('/auth')
  }
})
</script>
<template></template>

<style lang="scss" scoped></style>
