<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/server/supabase/user";
import type { Sessions } from "@/types/user";
import { useRouter } from "vue-router";
import DropdownMenuContent from "../ui/dropdown-menu/DropdownMenuContent.vue";
import { Skeleton } from "../ui/skeleton";
const router = useRouter();
const props = defineProps<{
  user: Sessions | undefined;
  isLoading: boolean;
}>();
const handleLogout = async () => {
  await logout();
  router.push("/login");
};
const handleLogin = () => {
  router.push("/login");
};
</script>
<template>
  <div v-if="!props.isLoading">
    <div v-if="props.user">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage
              :src="props.user?.user.user_metadata.avatar_url"
              alt="@radix-vue"
            />
            <AvatarFallback>{{
              props.user?.user.user_metadata.name
            }}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem as-child>
            <Button
              class="w-full cursor-pointer hover:bg-[#fff] dark:hover:bg-[#272727]"
              variant="ghost"
              @click="handleLogout"
            >
              退出
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="h-10 w-10" v-else>
      <Button
        class="w-full h-full rounded-sm"
        variant="outline"
        @click="handleLogin"
        >登录</Button
      >
    </div>
  </div>
  <div v-else>
    <div class="h-10 w-10">
      <Skeleton class="h-full w-full rounded-full" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
