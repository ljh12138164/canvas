<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import InviteCode from '@/components/workspace/InviteCode.vue';
import MemberTable from '@/components/workspace/MemberTable.vue';
import { useCollaborators } from '@/hooks/collaborators';
import { useQueryClient } from '@tanstack/vue-query';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const queryClient = useQueryClient();
const route = useRoute();
const router = useRouter();
const workspaceId = ref(route.params.workspaceId as string);
watch(
  () => route.params.workspaceId,
  (newVal) => {
    workspaceId.value = newVal as string;
  },
);
onBeforeMount(() => {
  queryClient.invalidateQueries({ queryKey: ['collaborators'] });
});
const fullPathArr = ref(route.fullPath.split('/'));
watch(
  () => route.fullPath,
  (newVal) => {
    fullPathArr.value = newVal.split('/');
  },
);
const { collaborators, isLoading: collaboratorsIsLoading } = useCollaborators(workspaceId.value);
// const { inviteCollaborator } = useInviteCollaborator();
</script>
<template>
  <div class="container">
    <ScrollArea class="h-[80dvh]">
      <nav class="nav-container" v-if="fullPathArr.length < 2">
        <Button @click="router.back()">返回</Button>
      </nav>
      <div class="flex flex-col gap-4">
        <!-- 邀请码 -->
        <InviteCode :collaborators="collaborators" :isLoading="collaboratorsIsLoading" />
        <!-- 成员列表 -->
        <MemberTable :collaborators="collaborators" :isLoading="collaboratorsIsLoading" />
        <!--  -->
      </div>
    </ScrollArea>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 20px;
}

.nav-container {
  padding: 20px;
}
</style>
