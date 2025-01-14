<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

const jumpt = async () => {
  const id = nanoid();
  await navigateTo("/workspace/create/" + id);
};
</script>
<template>
    <Button @click="jumpt"> 创建表单 </Button>
</template>
