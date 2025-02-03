<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { logout } from '@/database/supabase/user';
import { DEFAULT_AVATAR } from '@/lib';
import useUser from '@/stores/user';
import type { PropType } from 'vue';
import { useRouter } from 'vue-router';
const userData = useUser().userData;
type Side = 'end' | 'start' | 'center';
const router = useRouter();
const props = defineProps({
  side: {
    type: String as PropType<Side>,
    default: 'end',
  },
});
const logoutClick = async () => {
  await logout();
  router.push('/auth');
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="icon" class="rounded-full">
        <Avatar>
          <AvatarImage :src="userData!.session.user.user_metadata?.image || DEFAULT_AVATAR" />
          <AvatarFallback>
            <Skeleton class="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <span class="sr-only">切换用户菜单</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent :align="props.side">
      <DropdownMenuLabel>我的账户</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>设置</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="logoutClick">登出</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
