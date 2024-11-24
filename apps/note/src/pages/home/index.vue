<script setup lang="ts">
import { logout } from "@/server/supabase/user";
import { useRouter } from "vue-router";
const router = useRouter();
const handleClick = () => {
  router.push("/login");
};
</script>
<template>
  <button @click="handleClick">跳转登录</button>
  <button @click="logout">登出</button>
</template>

<style scoped></style>
