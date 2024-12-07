<script lang="ts" setup>
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue';
import InviteCode from '@/components/workspace/InviteCode.vue';
import MemberTable from '@/components/workspace/MemberTable.vue';
import { useCollaborators } from '@/hooks/collaborators';
import useUser from '@/store/user';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const { userData } = useUser();
const route = useRoute();
const workspaceId = ref(route.params.workspaceId as string);
watch(
  () => route.params.workspaceId,
  (newVal) => {
    workspaceId.value = newVal as string;
  },
);
const token = userData?.session.access_token as string;
const { collaborators, isLoading: collaboratorsIsLoading } = useCollaborators(
  workspaceId.value,
  token,
);
// const { inviteCollaborator } = useInviteCollaborator(token);
</script>
<template>
  <div class="container">
    <ScrollArea class="h-[80dvh]">
      <div class="flex flex-col gap-4">
        <InviteCode
          :collaborators="collaborators"
          :isLoading="collaboratorsIsLoading"
        />
        <MemberTable
          :collaborators="collaborators"
          :token="token"
          :isLoading="collaboratorsIsLoading"
        />
      </div>
    </ScrollArea>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
</style>
