<script setup lang="ts">
import Sider from "@/components/border/Sider.vue";
import { useBoard } from "@/hooks/board";
import useUser from "@/store/user";
import { ref, watch } from "vue";
import { RouterView, useRoute } from "vue-router";
import NavHeader from "./NavHeader.vue";
const route = useRoute();
// const router = useRouter();

const routerParams = ref(route.params.worskpaceId);
const userData = useUser().userData!;
const { folders, foldersError, foldersIsLoading } = useBoard(
  userData.session.access_token
);

watch(
  () => route.params.worskpaceId,
  () => {
    routerParams.value = route.params.worskpaceId;
  },
  { immediate: true }
);
</script>
<template>
  <main class="content">
    <section class="sider-container">
      <Sider
        :folders="folders"
        :isLoading="foldersIsLoading"
        :foldersError="foldersError"
      />
    </section>
    <section class="editor-container">
      <NavHeader />
      <keep-alive>
        <main class="editor-main">
          <RouterView />
        </main>
      </keep-alive>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100dvh;
  display: flex;
}
.sider-container {
  width: 200px;
  height: 100%;
  border-right: 2px solid #92929f9a;
}
.editor-container {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

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
