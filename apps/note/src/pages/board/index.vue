<script setup lang="ts">
import { client } from "@/server";
import useUser from "@/store/user";
import { onMounted } from "vue";
const { userData } = useUser();
onMounted(() => {
  if (!userData) return;
  client.board.$get(
    {
      query: { id: "1" },
    },
    {
      headers: { Authorization: "Bearer " + userData.session.access_token },
    }
  );
});
</script>
<template>
  <div class="content"></div>
</template>
<style scoped lang="scss">
.content {
  width: 100%;
  height: 100dvh;
}
</style>
