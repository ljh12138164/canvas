<script setup lang="ts">
import type { Files, Folders } from '@/types/board';
import { Icon } from '@iconify/vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import CardContent from '../ui/card/CardContent.vue';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import ResponsePop from '../workspace/Respone.vue';
import FileFrom from './FileFrom.vue';
import FileItem from './FileItem.vue';

defineProps<{
  folder: Folders & { files: Files[] };
  isSmall: boolean;
  isLoading: boolean;
}>();
const route = useRoute();
const folderItemRef = ref<string>(route.params.folderId as string);
const openFloaders = ref<string[]>([]);
watch(
  () => route.params.folderId,
  () => {
    folderItemRef.value = route.params.folderId as string;
  },
);
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div
          class="folder-item bg-[#f1f1f1] dark:bg-[#242424] hover:bg-[#dbdbdb] dark:hover:bg-gray-800 hover:text-black transition-all duration-300"
          :class="{
            smallItem: isSmall,
          }">
          <Icon :class="{
            smallIcon: isSmall,
          }" width="15" height="15" :icon="openFloaders.find((item) => item === folder.id)
            ? 'ion:chevron-up'
            : 'ion:chevron-down'
            " @click="() => {
              if (isLoading) return;
              openFloaders.find((item) => item === folder.id)
                ? openFloaders.splice(
                  openFloaders.indexOf(folder.id as string),
                  1
                )
                : openFloaders.push(folder.id as string);
            }
              " />
          <!-- ion:chevron-up -->
          <span class="folder-item-title" :class="{ 'text-left': !isSmall }">
            <span :class="{
              small: isSmall,
            }">{{ folder.inconId }}</span>
            <span class="folder-item-title" v-show="!isSmall">{{
              folder.title
            }}</span>
          </span>
          <ResponsePop title="添加文件">
            <template #trigger>
              <Icon icon="ion:add" v-show="!isSmall" />
            </template>
            <template #content>
              <CardContent>
                <FileFrom />
              </CardContent>
            </template>
          </ResponsePop>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <span>{{ folder.title }}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <section class="file-list" :class="{
    trans: openFloaders.find((item) => item === (folder.id as string)),
  }">
    <FileItem :file="folder.files" :isSmall="isSmall" :openFolders="!!openFloaders.find((item) => item === (folder.id as string))
      " :isLoading="isLoading" />
  </section>
</template>
<style scoped lang="scss">
.folder-item {
  display: grid;
  grid-template-columns: 18px 1fr 18px;
  align-items: center;
  height: 30px;
}

.folder-item-title {
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
}

.file-list {
  display: grid;
  grid-template-rows: 0fr;
  width: 100%;
  transition: grid-template-rows 0.3s linear;
}

.small {
  text-align: center;
  flex: 1;
  width: 100%;
}

.smallIcon {
  width: 20%;
}

.smallItem {
  display: flex;
  padding: 0 2px 0 1px;
  align-items: center;
  // justify-content: center;
}

.trans {
  grid-template-rows: 1fr;
}
</style>
