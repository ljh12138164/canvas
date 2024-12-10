<script setup lang="ts">
import type { Files, Folders } from '@/types/board';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { onMounted, ref } from 'vue';
// @ts-ignore
import ResponsePop from '../common/ResponsePop.vue';
import FoladerItem from './FoladerItem.vue';
import From from './From.vue';
import SiderbarItem from './SiderbarItem.vue';
const asiderRef = ref<HTMLElement>();
// import FromCard from './FromCard.vue';
const isSmall = ref(false);
onMounted(() => {
  isSmall.value = (asiderRef.value as HTMLElement).clientWidth < 100;
  const newObserver = new ResizeObserver(
    (entries) => (isSmall.value = entries[0].contentRect.width < 100),
  );
  newObserver.observe(asiderRef.value as HTMLElement);
});
const { isLoading, foldersError, folders } = defineProps<{
  isLoading: boolean;
  foldersError: Error | null;
  folders: (Folders & { files: Files[] })[] | undefined;
}>();
</script>
<template>
  <aside class="asider" ref="asiderRef">
    <header class="asider-header">工作站</header>

    <aside class="asider-siderbar">
      <SiderbarItem>
        <template #default>
          <ResponsePop title="创建文档">
            <template #trigger>
              <div class="w-full h-full">
                <p
                  class="flex items-center gap-2"
                  :style="{
                    'justify-content': isSmall ? 'center' : 'flex-start',
                  }"
                >
                  <Icon icon="gg:add" />
                  <span v-show="!isSmall">创建文档</span>
                </p>
              </div>
            </template>
            <template #content>
              <div>
                <From />
              </div>
            </template>
          </ResponsePop>
        </template>
      </SiderbarItem>
      <SiderbarItem>
        <template #default>
          <div class="w-full h-full">
            <p
              class="flex items-center gap-2"
              :style="{
                'justify-content': isSmall ? 'center' : 'flex-start',
              }"
            >
              <Icon icon="gg:trash" />
              <span v-show="!isSmall">回收站</span>
            </p>
          </div>
        </template>
      </SiderbarItem>
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
    </main>
  </aside>
</template>

<style lang="scss" scoped>
/* .footer-button {
  margin-top: 10px;
  width: 100%;
} */
.asider {
  padding: 10px 5px;
}
.asider-siderbar {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.folderList {
  width: 100%;
  display: flex;
  flex-direction: column;
  // gap: 2px;
}
</style>
