<script setup lang="ts">
import Sider from "@/components/border/Sider.vue";
import ThemeChange from "@/components/common/ThemeChange.vue";
import Editor from "@/components/Edit/Tiptap.vue";
import { useBoard } from "@/hooks/board";
import useUser from "@/store/user";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
// const router = useRouter();
const routerParams = ref(route.params.id);
const userData = useUser().userData!;
const { data, isLoading } = useBoard(userData.session.access_token);

watch(
  () => route.params.id,
  () => {
    routerParams.value = route.params.id;
  },
  { immediate: true }
);
</script>
<template>
  <main class="content">
    <section class="sider-container">
      <Sider />
    </section>
    <section class="editor-container">
      <nav class="nav-container">
        <ThemeChange />
      </nav>
      <main class="editor-main">
        <Editor />
      </main>
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
.nav-container {
  width: 100%;
  height: 50px;
  border-bottom: 2px solid #92929f9a;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
}
.editor {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-main {
    height: 100%;
    padding: 20px;
  }
}
</style>
