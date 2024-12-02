<script setup lang="ts">
import { Folders } from "@/types/board";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import FromCard from "./FromCard.vue";
import { Button } from "../ui/button";
import { Icon } from "@iconify/vue/dist/iconify.js";

const { isLoading, foldersError, folders } = defineProps<{
  isLoading: boolean;
  foldersError: Error | null;
  folders: Folders[] | undefined;
}>();
</script>
<template>
  <aside>
    <header>工作站</header>
    <aside>
      <Popover>
        <PopoverTrigger
          ><Button><Icon icon="gg:add" />创建文档</Button></PopoverTrigger
        >
        <PopoverContent as-child>
          <FromCard />
        </PopoverContent>
      </Popover>
    </aside>
    <main>
      <div v-if="isLoading">加载中...</div>
      <div v-else-if="foldersError">
        <div>{{ foldersError.message }}</div>
      </div>
      <div v-else-if="folders?.length === 0">
        <div>暂无数据</div>
      </div>
      <div v-else>
        <span v-for="folder in folders" :key="folder.id">
          {{ folder.title }}
        </span>
      </div>
    </main>
  </aside>
</template>

<style lang="scss" scoped></style>
