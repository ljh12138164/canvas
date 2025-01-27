<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { logout } from '@/server/supabase/user';
import useUser from '@/store/user';
import { useRouter } from 'vue-router';
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue';
const router = useRouter();

const { userData } = useUser();
const handleLogout = async () => {
  await logout();
  router.push('/login');
};
const handleLogin = () => {
  router.push('/login');
};
</script>
<template>
  <DropdownMenu v-if="userData?.session.user">
    <DropdownMenuTrigger>
      <template #default>
        <Avatar>
          <AvatarImage :src="userData?.session.user.user_metadata.image" alt="用户图像" />
          <AvatarFallback>{{
            userData?.session.user.user_metadata.name
            }}</AvatarFallback>
        </Avatar>
      </template>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem as-child>
        <Button class="w-full cursor-pointer hover:bg-[#fff] dark:hover:bg-[#272727]" variant="ghost"
          @click="handleLogout">
          退出
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <Button v-else class="w-full h-full rounded-sm" variant="outline" @click="handleLogin">登录</Button>
</template>
