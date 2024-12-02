<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import From from './From.vue';


</script>
<template>
  <Card>
    <CardHeader>
      <CardTitle>创建工作间</CardTitle>
      <CardDescription> 创建一个工作间来开始 </CardDescription>
    </CardHeader>
    <CardContent>
      <From />
    </CardContent>
    <CardFooter>
      <Button> 创建 </Button>
    </CardFooter>
  </Card>
</template>

<style scoped lang="scss"></style>
