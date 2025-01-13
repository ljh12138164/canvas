<script setup lang="ts">
import { useGetWorkspaceById, useGetWorkspaces } from '@/hooks/workspace';
import type { Workspace } from '@/types/board';
import type { Profiles } from '@/types/user';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Skeleton from '../ui/skeleton/Skeleton.vue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
const props = defineProps<{
  workspaces: (Workspace & { profiles: Profiles })[] | undefined;
  isLoading: boolean;
  isFetching: boolean;
  token: string;
  error: Error | null;
}>();

const router = useRouter();
const route = useRoute();

const activeWorkspaceId = ref(route.params.workspaceId as string);
watch(
  () => route.params.workspaceId,
  (newVal) => {
    activeWorkspaceId.value = newVal as string;
  },
);
const { workspaceIsFetching } = useGetWorkspaceById(
  route.params.workspaceId as string,
);
const { workspacesIsLoading } = useGetWorkspaces();
const handleClick = (id: string) => {
  if (workspaceIsFetching.value || workspacesIsLoading.value) return;
  router.push(`/workspace/${id}`);
};
</script>
<template>
  <div class="workspace-list-container">
    <div v-if="props.isLoading">
      <Skeleton class="w-full h-[50px] bg-[#d8d8d8] dark:bg-[#3a3a3a]" />
    </div>
    <div v-else-if="props.workspaces">
      <TooltipProvider
        v-for="workspace in props.workspaces"
        :key="workspace.id"
      >
        <Tooltip>
          <TooltipTrigger as-child>
            <div
              class="workspace-item hover:bg-[#dcdcdc] dark:hover:bg-[#454648] transition-colors duration-300"
              @click="handleClick(workspace.id as string)"
              :disabled="
                props.isFetching || workspacesIsLoading || workspaceIsFetching
              "
              :class="{
                'bg-[#dcdcdc] dark:bg-[#454648]':
                  activeWorkspaceId === workspace.id,
                'bg-[#fff] dark:bg-[#272727]':
                  activeWorkspaceId !== workspace.id,
              }"
            >
              <span class="text-lg">{{ workspace.inconId }}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div class="text-sm">
              {{ workspace.title }}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div v-else>
      <div>无工作区</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.workspace-list-container {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.workspace-item {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
