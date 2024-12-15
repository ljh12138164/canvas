<script setup lang="ts">
import FormCreate from '@/components/form/FormCreate.vue'
import { Button } from '@/components/ui/button'
import { ref, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
const router = useRouter()
const route = useRoute()
const id = ref(route.params.id)
watch(
  () => route.params.id,
  (newVal) => {
    id.value = newVal
  },
)
</script>
<template>
  <FormCreate />
  <Button>保存</Button>
</template>
