<script setup lang="ts">
const { isLoading, foldersError } = defineProps<{
  isLoading: boolean;
  foldersError: Error | null;
}>();
</script>
<template>
  <aside>
    <header>工作站</header>
    <main>
      {{ isLoading }}
      {{ foldersError }}
    </main>
  </aside>
</template>

<style lang="scss" scoped></style>
