<script setup lang="ts">
import ThemeChange from '@/components/common/ThemeChange.vue';
import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { downloadFile } from '@/lib';
import { useActiveUserStore } from '@/store/activeUser';
import useEditor from '@/store/editor';
import useUserStore from '@/store/user';
import type { Files, Folders } from '@/types/board';
import { Icon } from '@iconify/vue';
import { nanoid } from 'nanoid';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const activeUserStore = useActiveUserStore();
const userStore = useUserStore();
const user = userStore.userData?.session.user;
// console.log(user);
const props = defineProps<{
  folders: (Folders & { files: Files[] })[] | undefined;
  isLoading: boolean;
  foldersError: Error | null;
}>();
const route = useRoute();
const folderId = ref('');
const fileId = ref('');
const fileName = ref('');
watch(
  () => route.params,
  () => {
    if (route.params.folderId) {
      folderId.value = route.params.folderId as string;
    }
    if (route.params.fileId) {
      fileId.value = route.params.fileId as string;
    }
    if (route.params.fileId) {
      fileName.value =
        props.folders
          ?.find((item) => item.id === folderId.value)
          ?.files.find((item) => item.id === fileId.value)?.title + nanoid(6) || `${nanoid(6)}文件`;
    } else {
      fileName.value =
        props.folders?.find((item) => item.id === folderId.value)?.title + nanoid(6) ||
        `${nanoid(6)}文件夹`;
    }
  },
  {
    immediate: true,
  },
);
const onSaveJson = () => {
  const jsonData = useEditor().editorDatas?.getJSON();
  const blob = new Blob([JSON.stringify(jsonData)], {
    type: 'application/json',
  });
  downloadFile(blob, `${fileName.value}.json`);
};
const onSaveHtml = () => {
  const htmlData = useEditor().editorDatas?.getHTML();
  if (!htmlData) return;
  const blob = new Blob([htmlData], { type: 'text/html' });
  downloadFile(blob, `${fileName.value}.html`);
};
const onSaveText = () => {
  const textData = useEditor().editorDatas?.getText();
  if (!textData) return;
  const blob = new Blob([textData], { type: 'text/plain' });
  downloadFile(blob, `${fileName.value}.txt`);
};
</script>
<template>
  <nav class="nav-container">
    <header v-if="useEditor().editorDatas"
      class="flex h-14 w-full shrink-0 items-center justify-between gap-2 px-2 sm:px-4 transition-all duration-200 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div class="flex items-center gap-2 sm:gap-3">
        <SidebarTrigger class="hover:bg-muted/60 rounded-md p-1 transition-colors" />
        <Separator orientation="vertical" class="h-5 hidden sm:block" />
      </div>

      <div class="flex items-center gap-2 sm:gap-4">
        <Menubar v-if="useEditor().editorDatas" class="border-none">
          <MenubarMenu>
            <MenubarTrigger class="active:bg-transparent" as-child>
              <span
                class="dark:hover:bg-zinc-800 dark:bg-zinc-800 hover:bg-zinc-100 rounded-md p-1 transition-all bg-transparent">
                <span class="hidden sm:inline cursor-pointer">导出文件</span>
                <Icon icon="mdi:export" class="h-5 w-5 sm:hidden" />
              </span>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem as-child>
                <Button variant="ghost" @click="onSaveJson" class="btn-item w-full justify-start cursor-pointer">
                  <Icon icon="mdi:file-document-outline" class="h-4 w-4" />
                  <span class="hidden sm:inline">JSON导出</span>
                  <span class="sm:hidden">JSON</span>
                </Button>
              </MenubarItem>
              <MenubarItem as-child>
                <Button variant="ghost" @click="onSaveHtml"
                  class="btn-item w-full justify-start dark:hover:bg-slate-900 transition-all  hover:bg-zinc-100 cursor-pointer">
                  <Icon icon="mdi:file-document-outline" class="h-4 w-4" />
                  <span class="hidden sm:inline">HTML导出</span>
                  <span class="sm:hidden">HTML</span>
                </Button>
              </MenubarItem>
              <MenubarItem as-child>
                <Button variant="ghost" @click="onSaveText" class="btn-item w-full justify-start">
                  <Icon icon="mdi:file-document-outline" class="h-4 w-4" />
                  <span class="hidden sm:inline">文本导出</span>
                  <span class="sm:hidden">文本</span>
                </Button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <ThemeChange />
      </div>

      <div v-if="user" class="flex items-center gap-2 dark:bg-zinc-600 bg-zinc-100 rounded-xl px-2 py-1">
        <Icon icon="mdi:account-circle" class="h-4 w-4 sm:h-5 sm:w-5 dark:text-white" />
        <span class="hidden sm:inline">{{ user.user_metadata.name }}</span>
        <span class="rounded-full bg-primary/10 px-1.5 sm:px-2 py-0.5 text-xs font-medium text-primary">
          {{ activeUserStore.activeUserList.size }}
        </span>
      </div>
    </header>
  </nav>
</template>

<style scoped lang="scss">
.nav-container {
  width: 100%;
  border-bottom: 1px solid rgba(var(--border), 0.4);
  background-color: rgba(var(--background), 0.95);
  backdrop-filter: blur(8px);

  @supports (backdrop-filter: blur(0px)) {
    background-color: rgba(var(--background), 0.6);
  }

  @media (max-width: 640px) {
    position: sticky;
    top: 0;
    z-index: 50;
  }
}

.btn-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  transition: colors 0.2s;
  gap: 0.375rem;

  @media (min-width: 640px) {
    gap: 0.5rem;
    font-size: 0.875rem;
  }

  &:hover {
    background-color: rgba(var(--muted), 0.6);
  }

  .iconify {
    height: 1rem;
    width: 1rem;
  }
}
</style>
