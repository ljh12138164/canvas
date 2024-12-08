<script setup lang="ts">
import Sider from '@/components/border/Sider.vue';
import ThemeChange from '@/components/common/ThemeChange.vue';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { downloadFile } from '@/lib';
import useEditor from '@/store/editor';
import { Icon } from '@iconify/vue';
import { Folders } from '@/types/board';
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 768px)');
const props = defineProps<{
  folders: Folders[] | undefined;
  isLoading: boolean;
  foldersError: Error | null;
}>();
const onSaveJson = () => {
  const jsonData = useEditor().editorDatas?.getJSON();
  const blob = new Blob([JSON.stringify(jsonData)], {
    type: 'application/json',
  });
  // TODO:文档名
  downloadFile(blob, 'data.json');
};
const onSaveHtml = () => {
  const htmlData = useEditor().editorDatas?.getHTML();
  if (!htmlData) return;
  const blob = new Blob([htmlData], { type: 'text/html' });
  downloadFile(blob, 'data.html');
};
const onSaveText = () => {
  const textData = useEditor().editorDatas?.getText();
  if (!textData) return;
  const blob = new Blob([textData], { type: 'text/plain' });
  downloadFile(blob, 'data.txt');
};
</script>
<template>
  <nav class="nav-container">
    <div v-show="isMobile">
      <Sheet align="left">
        <SheetTrigger>
          <Icon icon="mdi:menu" />
        </SheetTrigger>
        <SheetContent side="left" class="w-[40dvw]">
          <Sider
            :folders="props.folders"
            :isLoading="props.isLoading"
            :foldersError="props.foldersError"
          />
        </SheetContent>
      </Sheet>
    </div>
    <Menubar v-if="useEditor().editorDatas">
      <MenubarMenu>
        <MenubarTrigger>文件</MenubarTrigger>
        <MenubarContent :as-child="true">
          <div>
            <Button variant="outline" @click="onSaveJson">下载json文件</Button>
            <Button variant="outline" @click="onSaveHtml">下载html文件</Button>
            <Button variant="outline" @click="onSaveText">下载txt文件</Button>
          </div>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <div v-if="useEditor().editorDatas">
      <ThemeChange />
    </div>
  </nav>
</template>

<style scoped lang="scss">
.nav-container {
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #92929f9a;
  display: flex;
  align-items: center;
  padding-right: 20px;
}
</style>
