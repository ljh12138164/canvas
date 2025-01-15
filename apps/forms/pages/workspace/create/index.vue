<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

const jumpt = async () => {
  const id = nanoid();
  await navigateTo("/workspace/create/" + id);
};
</script>
<template>
  <section class="entry">
    <RouterLink :to="`/workspace/create/${nanoid()}`">
      <Button>创建表单</Button>
    </RouterLink>
  </section>
</template>
