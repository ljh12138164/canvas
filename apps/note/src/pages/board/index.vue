<script setup lang="ts">
import EmojiPop from "@/components/border/EmojiPop.vue";
// onMounted(() => {
//   if (!userData) return;
//   client.board.$get(
//     {
//       query: { id: "1" },
//     },
//     {
//       headers: { Authorization: "Bearer " + userData.session.access_token },
//     }
//   );
// });
</script>
<template>
  <div class="content">
    <EmojiPop />
  </div>
</template>
<style scoped lang="scss">
.content {
  width: 100%;
  height: 100dvh;
}
</style>
