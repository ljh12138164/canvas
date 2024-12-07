<script lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
watch(
  () => router.currentRoute.value.path,
  (path) => {
    console.log(path);
  }
);
</script>
<template>
  <div>11</div>
</template>

<style scoped lang="scss"></style>
