<script setup lang="ts">
import Sider from '@/components/border/Sider.vue';
import useUser from '@/store/user';
import { ref, watch } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import NavHeader from './NavHeader.vue';
const route = useRoute();
const router = useRouter();
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useGetWorkspaceById } from '@/hooks/workspace';
import { useMediaQuery } from '@vueuse/core';
const routerParams = ref(route.params.workspaceId);
const userData = useUser().userData!;

const { workspace, workspaceError, workspaceIsLoading } = useGetWorkspaceById(
  userData.session.access_token,
  routerParams.value as string
);
const isMobile = useMediaQuery('(max-width: 768px)');
watch(
  () => route.params.folderId,
  () => {
    routerParams.value = route.params.workspaceId;
  }
);
watch(workspaceError, (newVal) => {
  if (newVal?.message === '无权限') {
    router.push('/workspace');
  }
});
</script>
<template>
  <main class="content">
    <ResizablePanelGroup
      id="handle-demo-group-1"
      direction="horizontal"
      class="min-h-[200px] rounded-lg border"
    >
      <ResizablePanel
        v-show="!isMobile"
        id="handle-demo-panel-1"
        :default-size="20"
        :max-size="30"
        :min-size="8"
      >
        <section class="sider-container">
          <Sider
            :folders="workspace?.folders"
            :isLoading="workspaceIsLoading"
            :workspace="workspace"
            :foldersError="workspaceError"
          />
        </section>
      </ResizablePanel>
      <ResizableHandle id="handle-demo-handle-1" with-handle />
      <ResizablePanel
        id="handle-demo-panel-2 "
        class="editor-containe"
        :default-size="75"
      >
        <NavHeader
          :folders="workspace?.folders"
          :isLoading="workspaceIsLoading"
          :foldersError="workspaceError"
        />
        <keep-alive>
          <main class="editor-main">
            <RouterView />
          </main>
        </keep-alive>
      </ResizablePanel>
    </ResizablePanelGroup>
  </main>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100dvh;
  display: flex;
}
.sider-container {
  height: 100%;
  border-right: 2px solid #92929f9a;
}
/* .editor-container {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
} */

.editor {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-main {
    flex: 1;
    height: 100%;
  }
}
</style>
