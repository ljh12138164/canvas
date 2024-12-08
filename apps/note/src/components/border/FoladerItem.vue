<script setup lang="ts">
import { Folders } from '@/types/board';
import { Icon } from '@iconify/vue';
import { ref, watch } from 'vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { useRoute } from 'vue-router';
import FileItem from './FileItem.vue';
defineProps<{
  folder: Folders;
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
  }
);
</script>
<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        ><div
          class="folder-item flex bg-[#f1f1f1] hover:bg-[#dbdbdb] hover:text-black transition-all duration-300"
          :class="{
            smallItem: isSmall,
          }"
        >
          <Icon
            :class="{
              smallIcon: isSmall,
            }"
            v-show="!isSmall"
            width="15"
            height="15"
            icon="ion:chevron-down"
          />
          <!-- ion:chevron-up -->
          <span class="flex-1 justify-start" :class="{ 'text-left': !isSmall }">
            <span
              :class="{
                small: isSmall,
              }"
              >{{ folder.inconId }}</span
            >
            <span class="folder-item-title" v-show="!isSmall">{{
              folder.title
            }}</span>
          </span>
          <Icon icon="ion:add" v-show="!isSmall" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <span>{{ folder.title }}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <FileItem
    :file="folder.files"
    :isSmall="isSmall"
    :openFolders="openFloaders"
    :isLoading="isLoading"
  />
</template>
<style scoped lang="scss">
.folder-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 30px;
}
.folder-item-title {
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 50%;
  text-align: center;
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
  padding: 0 10px;
  align-items: center;
}
</style>
