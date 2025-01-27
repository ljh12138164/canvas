<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Files } from '@/types/board';

defineProps<{
  isLoading: boolean;
  file: Files[];
  isSmall: boolean;
  openFolders: boolean;
}>();
</script>
<template>
  <section class="file-item w-full overflow-hidden">
    <div v-for="file in file" class="w-full" :key="file.id">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div class="folder-item bg-[#f1f1f1] hover:bg-[#dbdbdb] hover:text-black transition-all duration-300"
              :class="{
                smallItem: isSmall,
              }">
              <div></div>
              <span class="folder-item-title" :class="{ 'text-left': !isSmall }">
                <span :class="{
                  small: isSmall,
                }">{{ file.inconId }}</span>
                <span class="folder-item-title" v-show="!isSmall">{{
                  file.title
                }}</span>
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <span>{{ file.title }}</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </section>
</template>

<style scoped lang="scss">
.folder-item {
  display: grid;
  cursor: pointer;
  grid-template-columns: 18px 1fr 18px;
  align-items: center;
  height: 30px;
}

.folder-item-title {
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  // text-align: center;
}

.file-list {
  max-height: 100%;
  overflow: auto;
  display: grid;
  grid-template-rows: 1fr;
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
  justify-content: center;
}
</style>
