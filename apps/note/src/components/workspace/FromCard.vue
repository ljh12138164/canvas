<script setup lang="ts">
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import From from './From.vue';
</script>
<template>
  <CardHeader>
    <CardTitle>创建工作间</CardTitle>
    <CardDescription> 创建一个工作间来开始 </CardDescription>
  </CardHeader>
  <CardContent>
    <From />
  </CardContent>
</template>

<style scoped lang="scss">
.emoji {
  font-size: 2em;
}
</style>
