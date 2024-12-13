<script setup lang="ts">
import { ChevronRight, Plus } from 'lucide-vue-next';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '../ui/sidebar';
import { Skeleton } from '../ui/skeleton';
import { useGetWorkspaceById } from '@/hooks/workspace';
import ResponsePop from '../common/ResponsePop.vue';
import FileFrom from './FileFrom.vue';

const props = defineProps<{
  token: string;
  routerParams: string;
}>();

const { workspace, workspaceError, workspaceIsLoading } = useGetWorkspaceById(
  props.token,
  props.routerParams
);
</script>
<template>
  <div>
    <SidebarMenuItem v-if="!workspaceIsLoading">
      <Collapsible
        as-child
        class="group/collapsible"
        v-for="item in workspace?.folders"
        :key="item.title"
      >
        <section>
          <CollapsibleTrigger as-child>
            <div class="flex items-center gap-2">
              <SidebarMenuButton :tooltip="item.title">
                <ChevronRight
                  class="transition-transform duration-200group-data-[state=open]/collapsible:rotate-90"
                />
                <span>{{ item.inconId }}</span>
                <span class="group-data-[collapsible=icon]:hidden">{{
                  item.title
                }}</span>
                <ResponsePop title="新建文件">
                  <template #trigger>
                    <Plus class="ml-auto" />
                  </template>
                  <template #content>
                    <FileFrom />
                  </template>
                </ResponsePop>
              </SidebarMenuButton>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub v-for="items in item?.files" :key="items.title">
              <SidebarMenuSubItem :key="items.id">
                <SidebarMenuSubButton as-child>
                  <span>{{ items.inconId }}</span>
                  <span>{{ items.title }}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </section></Collapsible
      >
    </SidebarMenuItem>
    <div v-else-if="workspaceError">
      <div>{{ workspaceError.message }}</div>
    </div>
    <div v-else>
      <Skeleton class="h-10 w-full" />
    </div>
  </div>
</template>
<!-- <main class="asider-main">
  <div v-if="isLoading">加载中...</div>
  <div v-else-if="foldersError">
    <div>{{ foldersError.message }}</div>
  </div>
  <div v-else-if="folders?.length === 0">
    <div>暂无数据</div>
  </div>
  <div v-else>
    <div class="folderList">
      <FoladerItem
        :is-loading="isLoading"
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        :is-small="isSmall"
      />
    </div>
  </div>
</main> -->

<style lang="scss" scoped>
/* .footer-button {
  margin-top: 10px;
  width: 100%;
} */

.folderList {
  width: 100%;
  display: flex;
  flex-direction: column;
  // gap: 2px;
}
</style>
