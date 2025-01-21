<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetWorkspaceById } from '@/hooks/workspace';
import { useQueryClient } from '@tanstack/vue-query';
import { ChevronRight, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ResponsePop from '../common/ResponsePop.vue';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Input } from '../ui/input';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '../ui/sidebar';
import { Skeleton } from '../ui/skeleton';
import FileFrom from './FileFrom.vue';
const queryClient = useQueryClient();
const route = useRoute();
const router = useRouter();
const props = defineProps<{
  routerParams: string;
}>();
const folderId = ref<string>(route.params.folderId as string);
const fileId = ref<string>(route.params.fileId as string);

watch(
  () => route.params.folderId,
  (newVal) => {
    // console.log(route.params);
    folderId.value = newVal as string;
  },
);
watch(
  () => route.params.fileId,
  (newVal) => {
    fileId.value = newVal as string;
  },
);
const { workspace, workspaceError, workspaceIsLoading } = useGetWorkspaceById(props.routerParams);

const handleClick = (id: string) => {
  if (id === folderId.value && !fileId.value) return;
  queryClient.invalidateQueries({
    queryKey: ['doc', props.routerParams],
  });
  router.push(`/workspace/${props.routerParams}/folders/${id}`);
};
const subHandleClick = (id: string, folderId: string) => {
  if (id === fileId.value) return;
  queryClient.invalidateQueries({
    queryKey: ['doc', props.routerParams],
  });
  router.push(`/workspace/${props.routerParams}/folders/${folderId}/files/${id}`);
};

const responsePopRef = ref<any>(null);

const closeDialog = () => {
  if (responsePopRef.value) {
    responsePopRef.value.closeRef?.click();
  }
};
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
              <SidebarMenuButton
                :tooltip="item.title"
                class="dark:hover:bg-slate-900 transition-all hover:bg-zinc-100"
                :class="{
                  'bg-slate-100': item.id === folderId && !fileId,
                }"
              >
                <ChevronRight
                  class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
                <div
                  class="flex items-center gap-2"
                  @click.stop="handleClick(item.id!)"
                >
                  <span>{{ item.inconId }}</span>
                  <span class="group-data-[collapsible=icon]:hidden">{{
                    item.title
                  }}</span>
                </div>
                <ResponsePop title="新建文件" ref="responsePopRef">
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
                <SidebarMenuSubButton
                  class="w-full cursor-pointer dark:hover:bg-slate-900 transition-all hover:bg-zinc-100"
                  :class="{
                    'bg-slate-100 dark:bg-slate-900': items.id === fileId,
                  }"
                >
                  <div
                    class="flex items-center gap-2"
                    @click.stop="subHandleClick(items.id!, item.id!)"
                  >
                    <span>{{ items.inconId }}</span>
                    <span class="group-data-[collapsible=icon]:hidden">{{
                      items.title
                    }}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" class="btn-item ml-auto">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56">
                      <DropdownMenuLabel>文件操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <ResponsePop title="重命名" ref="responsePopRef">
                          <template #trigger>
                            <Button
                              variant="ghost"
                              class="btn-item"
                              @click.stop
                              as-child
                            >
                              <span><Pencil class="mr-2 h-4 w-4" />重命名</span>
                            </Button>
                          </template>
                          <template #content>
                            <Input :default-value="items.title" />
                          </template>
                          <template #close>
                            <Button variant="outline" @click="closeDialog"
                              >取消</Button
                            >
                          </template>
                          <template #entry>
                            <Button variant="outline" @click="closeDialog"
                              >确定</Button
                            >
                          </template>
                        </ResponsePop>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ResponsePop title="删除" ref="responsePopRef">
                          <template #trigger>
                            <Button
                              variant="ghost"
                              class="btn-item"
                              @click.stop="
                                () => {
                                  responsePopRef?.closeRef2?.click();
                                  responsePopRef?.closeRef?.click();
                                }
                              "
                              as-child
                            >
                              <span><Trash2 class="mr-2 h-4 w-4" />删除</span>
                            </Button>
                          </template>
                          <template #content>
                            <span>确定删除吗？</span>
                          </template>
                          <template #close>
                            <Button variant="outline">取消</Button>
                          </template>
                          <template #entry>
                            <Button variant="outline">确定</Button>
                          </template>
                        </ResponsePop>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
// .btn-item {
//   width: 1rem;
//   height: 1rem;
// }
</style>
