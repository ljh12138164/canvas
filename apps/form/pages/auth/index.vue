<script setup lang="ts">
const isLogin = ref(true);
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen">
    <header class="flex justify-end">
      <UIButton @click="isLogin = true">
        {{ isLogin ? '注册' : '登录' }}
      </UIButton>
      <UIButton @click="isLogin = false">
        {{ !isLogin ? '注册' : '登录' }}
      </UIButton>
    </header>
    <form>
      <UIInput type="text" />
      <UIInput type="password" />
      <UIButton type="submit">{{ isLogin ? '登录' : '注册' }}</UIButton>
    </form>
  </main>
</template>
