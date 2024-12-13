<script setup lang="ts">
import useBearStore from '~/stores/user';
import { checkUserLogin, toast } from '~/lib';
import { useRouter } from 'vue-router';
import Button from '~/components/ui/button/Button.vue';

const router = useRouter();
onBeforeMount(async () => {
  const user = await checkUserLogin();
  console.log(user);
  if (user) {
    useBearStore().setUser(user.session);
  } else {
    toast.error('请先登录');
    router.push('/auth');
  }
});
</script>

<template>
  <Button variant="outline" @click="toast.success('Hello')">Button</Button>
</template>
