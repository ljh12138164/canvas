<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { nanoid } from 'nanoid'
</script>
<template>
  <Button as-child>
    <RouterLink :to="{ path: '/create/' + nanoid() }">创建表单</RouterLink>
  </Button>
</template>
