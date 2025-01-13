<script setup lang="ts">
import type { CollaboratorsData } from '@/types/collaborators';
import { format } from 'date-fns';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
import Card from '../ui/card/Card.vue';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import { useRemoveCollaborator } from '@/hooks/collaborators';
import { Icon } from '@iconify/vue';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const router = useRouter();
const props = defineProps<{
  collaborators: CollaboratorsData[] | undefined;
  isLoading: boolean;
}>();
const { removeCollaborator, isRemoving } = useRemoveCollaborator();
watch(
  () => props.collaborators,
  (newVal) => {
    if (!props.isLoading && newVal?.length === 0) {
      toast.error('未找到工作区');
      router.push('/workspace');
    }
  }
);
</script>
<template>
  <Card v-if="!props.isLoading">
    <CardHeader>
      <CardTitle>成员</CardTitle>
    </CardHeader>
    <CardContent>
      <section v-if="props.collaborators?.[0]?.collaborators?.length">
        <Table>
          <TableCaption>成员列表</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead class="table-cell-ellipsis"> 加入时间 </TableHead>
              <TableHead class="table-cell-ellipsis">邮箱</TableHead>
              <TableHead class="table-cell-ellipsis">姓名</TableHead>
              <TableHead class="table-cell-ellipsis"> 操作 </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="collaborators in props.collaborators?.[0].collaborators"
              :key="collaborators.userId"
            >
              <TableCell class="table-cell-ellipsis">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>
                        {{
                          format(
                            new Date(collaborators.created_at),
                            'yyyy-MM-dd'
                          )
                        }}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {{
                        format(new Date(collaborators.created_at), 'yyyy-MM-dd')
                      }}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell class="table-cell-ellipsis">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>
                        {{ collaborators.profiles.email }}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {{ collaborators.profiles.email }}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell class="table-cell-ellipsis">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <span>
                        {{ collaborators.profiles.name }}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {{ collaborators.profiles.name }}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell class="table-cell-ellipsis">
                <Button
                  :disabled="isRemoving"
                  variant="outline"
                  size="icon"
                  @click="
                    removeCollaborator({
                      json: {
                        userId: collaborators.userId,
                        workspaceId: props.collaborators?.[0].id as string,
                      },
                    })
                  "
                >
                  <Icon icon="heroicons:trash" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
      <section v-else>
        <div>还未邀请成员</div>
      </section>
    </CardContent>
  </Card>
  <Skeleton v-else class="w-full h-[100px]" />
</template>

<style scoped lang="scss">
.table-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.table-cell-ellipsis {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
