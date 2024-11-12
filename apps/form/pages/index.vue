<script setup lang="tsx">
import { useQuery } from "@tanstack/vue-query";
import { client } from "~/database";

const { data, suspense } = useQuery({
  queryKey: ["test"],
  queryFn: async () => await client.$get(),
});
onMounted(async () => {
  await suspense();
});
</script>

<template>
  <div v-if="data">
    {{ data }}
  </div>
</template>
