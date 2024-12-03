<script setup lang="ts">
import { Folders } from "@/types/board";
import { Icon } from "@iconify/vue/dist/iconify.js";
// @ts-ignore
import ResponsePop from "../common/ResponsePop.vue";
import { Button } from "../ui/button";
import FromCard from "./FromCard.vue";

const { isLoading, foldersError, folders } = defineProps<{
  isLoading: boolean;
  foldersError: Error | null;
  folders: Folders[] | undefined;
}>();
</script>
<template>
  <aside class="asider">
    <header class="asider-header">工作站</header>
    <aside>
      <ResponsePop title="创建文档">
        <template #trigger>
          <Button><Icon icon="gg:add" />创建文档</Button>
        </template>
        <template #content>
          <FromCard />
        </template>
      </ResponsePop>
    </aside>
    <main class="asider-main">
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

<style lang="scss" scoped>
.footer-button {
  margin-top: 10px;
  width: 100%;
}
.asider {
  width: 200px;
  display: flex;
  flex-direction: column;

  &-header {
    font-size: 18px;
    font-weight: 600;
    flex-basis: 25dvh;
  }

  &-main {
    flex-basis: 75dvh;
  }
}
</style>
