<script setup lang="ts">
import ThemeChange from "@/components/common/ThemeChange.vue";
import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { downloadFile } from "@/lib";
import useEditor from "@/store/editor";
import type { Files, Folders } from "@/types/board";
import { Icon } from "@iconify/vue";
import { useMediaQuery } from "@vueuse/core";
import { nanoid } from "nanoid";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useActiveUserStore } from "@/store/activeUser";
import useUserStore from "@/store/user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const activeUserStore = useActiveUserStore();
const userStore = useUserStore();
const user = userStore.userData?.session.user;
console.log(user);
const props = defineProps<{
  folders: (Folders & { files: Files[] })[] | undefined;
  isLoading: boolean;
  foldersError: Error | null;
}>();
const route = useRoute();
const folderId = ref("");
const fileId = ref("");
const fileName = ref("");
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
          ?.files.find((item) => item.id === fileId.value)?.title + nanoid(6) ||
        nanoid(6) + "文件";
    } else {
      fileName.value =
        props.folders?.find((item) => item.id === folderId.value)?.title +
          nanoid(6) || nanoid(6) + "文件夹";
    }
  },
  {
    immediate: true,
  }
);
const isMobile = useMediaQuery("(max-width: 768px)");
const onSaveJson = () => {
  const jsonData = useEditor().editorDatas?.getJSON();
  const blob = new Blob([JSON.stringify(jsonData)], {
    type: "application/json",
  });
  downloadFile(blob, fileName.value + ".json");
};
const onSaveHtml = () => {
  const htmlData = useEditor().editorDatas?.getHTML();
  if (!htmlData) return;
  const blob = new Blob([htmlData], { type: "text/html" });
  downloadFile(blob, fileName.value + ".html");
};
const onSaveText = () => {
  const textData = useEditor().editorDatas?.getText();
  if (!textData) return;
  const blob = new Blob([textData], { type: "text/plain" });
  downloadFile(blob, fileName.value + ".txt");
};
</script>
<template>
  <nav class="nav-container">
    <header
      v-if="useEditor().editorDatas"
      class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div class="flex items-center gap-2 px-4" v-if="!isMobile">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
      </div>
      <Menubar v-if="useEditor().editorDatas">
        <MenubarMenu>
          <MenubarTrigger class="font-bold">导出文件</MenubarTrigger>
          <MenubarContent>
            <MenubarItem as-child>
              <Button
                variant="ghost"
                @click="onSaveJson"
                class="btn-item cursor-pointer"
              >
                <Icon icon="mdi:file-document-outline" />
                JSON导出
              </Button>
            </MenubarItem>
            <MenubarItem as-child>
              <Button
                variant="ghost"
                @click="onSaveHtml"
                class="btn-item cursor-pointer"
              >
                <Icon icon="mdi:file-document-outline" />
                HTML导出
              </Button>
            </MenubarItem>
            <MenubarItem as-child>
              <Button
                variant="ghost"
                @click="onSaveText"
                class="btn-item cursor-pointer"
              >
                <Icon icon="mdi:file-document-outline" />
                文本导出
              </Button>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <ThemeChange />
      </Menubar>
      <div v-if="user">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div class="flex items-center gap-2">
                <Icon icon="mdi:account-circle" />
                <span>{{ user.user_metadata.name }}</span>
                <span>{{ activeUserStore.activeUserList.size }}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent as-child>
              <div
                class="flex flex-col items-center gap-2 max-h-[300px] overflow-y-auto"
              >
                <img :src="user.user_metadata.image" alt="用户图片" />
                <span class="active-user">{{ user.user_metadata.name }}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  </nav>
</template>

<style scoped lang="scss">
.nav-container {
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #92929f9a;
  display: flex;
  align-items: center;
  padding: 0 10px;
}
.btn-item {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  cursor: pointer;
}
.active-user {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
