<script setup lang="ts">
import { useGetWorkspaceById } from '@/hooks/workspace';
import useUser from '@/store/user';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Edit from './Edit.vue';
const route = useRoute();
const workspaceId = ref(route.params.workspaceId);

watch(
  () => route.params.workspaceId,
  (newVal) => {
    workspaceId.value = newVal;
  }
);

const token = useUser().userData?.session.access_token as string;
const { workspace, workspaceIsLoading } = useGetWorkspaceById(
  token,
  workspaceId.value as string
);
</script>
<template>
  <div v-if="workspaceIsLoading">加载中</div>
  <div v-else>
    <div>
      {{ workspace?.title }}
      <Edit />
    </div>
  </div>
</template>

<style scoped></style>
