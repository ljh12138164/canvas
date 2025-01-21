<script setup lang="ts">
import From from '@/components/border/From.vue';
import Sider from '@/components/border/Sider.vue';
import ResponsePop from '@/components/common/ResponsePop.vue';
import UserButton from '@/components/common/UserButton.vue';
import { Collapsible } from '@/components/ui/collapsible';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail } from '@/components/ui/sidebar';
import SidebarGroupLabel from '@/components/ui/sidebar/SidebarGroupLabel.vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetWorkspaceById } from '@/hooks/workspace';
import useUser from '@/store/user';
import { useMediaQuery } from '@vueuse/core';
import { format } from 'date-fns';
import { Plus, Trash } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavHeader from './NavHeader.vue';

const route = useRoute();
const router = useRouter();

const routerParams = ref(route.params.workspaceId);
const { userData } = useUser();

const { workspace, workspaceError, workspaceIsLoading } = useGetWorkspaceById(routerParams.value as string);
const isMobile = useMediaQuery('(max-width: 768px)');
watch(
  () => route.params.folderId,
  () => {
    routerParams.value = route.params.workspaceId;
  },
);
watch(workspaceError, (newVal) => {
  if (newVal?.message === '无权限') {
    router.push('/workspace');
  }
});
</script>
<template>
  <SidebarProvider>
    <Sidebar collapsible="icon" v-if="!isMobile">
      <!-- 头部 -->
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent border data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                class="flex border px-4 aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
              >
                <span v-if="!workspaceIsLoading" class="text-xl">{{
                  workspace?.inconId
                }}</span>
                <Skeleton v-else class="size-4" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span
                  class="truncate font-semibold flex flex-col"
                  v-if="!workspaceIsLoading"
                  ><span class="text-ellipsis">
                    {{ workspace?.title }}
                  </span>
                  <span class="text-xs font-normal">
                    创建时间:
                    {{
                      format(
                        new Date(workspace?.created_at as string),
                        'yyyy-MM-dd'
                      )
                    }}
                  </span>
                </span>
                <Skeleton v-else class="size-4" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <!-- 内容 -->
      <SidebarContent>
        <SidebarGroup>
          <Collapsible as-child class="group/collapsible">
            <aside class="asider">
              <!-- nav -->
              <SidebarGroupLabel class="font-semibold text-sm"
                >工作区</SidebarGroupLabel
              >
              <SidebarMenuButton
                class="dark:hover:bg-slate-900 transition-all hover:bg-zinc-100"
              >
                <template #default>
                  <ResponsePop title="创建文档">
                    <template #trigger>
                      <div
                        class="w-full h-full flex items-center gap-2 dark:hover:bg-slate-900 transition-all hover:bg-zinc-100"
                      >
                        <Plus />
                        <span class="group-data-[collapsible=icon]:hidden"
                          >创建文档</span
                        >
                      </div>
                    </template>
                    <template #content>
                      <div>
                        <From />
                      </div>
                    </template>
                  </ResponsePop>
                </template>
              </SidebarMenuButton>

              <SidebarMenuButton
                class="dark:hover:bg-slate-900 transition-all hover:bg-zinc-100"
              >
                <template #default>
                  <div
                    class="w-full h-full flex items-center gap-2 dark:hover:bg-slate-900 hover:bg-zinc-100"
                  >
                    <Trash />
                    <span class="group-data-[collapsible=icon]:hidden"
                      >回收站</span
                    >
                  </div>
                </template>
              </SidebarMenuButton>
            </aside>
          </Collapsible>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            <Sider :routerParams="routerParams as string" />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <section class="footer-container">
          <!-- <Avatar class="h-8 w-8 rounded-lg">
            <AvatarImage
              :src="userData.session.user.user_metadata.image"
              :alt="userData.session.user.user_metadata.name"
            />
            <AvatarFallback class="rounded-lg">
              {{ userData.session.user.user_metadata.name }}
            </AvatarFallback>
          </Avatar> -->
          <!-- <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{
              userData.session.user.user_metadata.name
            }}</span>
            <span class="truncate text-xs">{{
              userData.session.user.user_metadata.email
            }}</span>
          </div> -->
          <UserButton
            :user="userData.session"
            :isLoading="workspaceIsLoading"
          />
        </section>
        <SidebarRail />
      </SidebarFooter>
    </Sidebar>
    <!-- 内容 -->
    <SidebarInset>
      <NavHeader
        :folders="workspace?.folders"
        :isLoading="workspaceIsLoading"
        :foldersError="workspaceError"
      />

      <keep-alive>
        <RouterView />
      </keep-alive>
    </SidebarInset>
  </SidebarProvider>
</template>

<style lang="scss" scoped>
.asider {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.content {
  width: 100%;
  height: 100dvh;
  display: flex;
}
.sider-container {
  height: 100%;
  border-right: 2px solid #92929f9a;
}
/* .editor-container {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
} */

.editor {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.sider-button {
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px;

  &:hover {
    border: 1px solid #f0f0f0;
  }
}
.footer-container {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
