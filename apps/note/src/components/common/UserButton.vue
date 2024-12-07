<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DropdownMenuContent from "../ui/dropdown-menu/DropdownMenuContent.vue";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "vue-router";
import { logout } from "@/server/supabase/user";
const router = useRouter();
const props = defineProps<{
  user: User | undefined;
  isLoading: boolean;
}>();
const handleLogout = () => {
  logout();
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
              :src="props.user?.user_metadata.image"
              alt="@radix-vue"
            />
            <AvatarFallback>{{
              props.user?.user_metadata.name
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
      <Button class="w-full h-full rounded-sm" variant="outline">登录</Button>
    </div>
  </div>
  <div v-else>
    <div class="h-10 w-10">
      <Skeleton class="h-full w-full rounded-full" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
