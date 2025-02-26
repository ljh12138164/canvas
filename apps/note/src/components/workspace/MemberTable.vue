<script setup lang="ts">
import { useRemoveCollaborator } from '@/hooks/collaborators';
import type { CollaboratorsData } from '@/types/collaborators';
import { Icon } from '@iconify/vue';
import { useQueryClient } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
import Card from '../ui/card/Card.vue';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import ResponsePop from './Respone.vue';

const queryClient = useQueryClient();
const router = useRouter();
const props = defineProps<{
  collaborators: CollaboratorsData[] | undefined;
  isLoading: boolean;
}>();
const responsePopRef = ref();
const { removeCollaborator, isRemoving } = useRemoveCollaborator();
watch(
  () => props.collaborators,
  (newVal) => {
    if (!props.isLoading && newVal?.length === 0) {
      toast.error('未找到工作区');
      router.push('/workspace');
    }
  },
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
              <TableHead class="table-cell-ellipsis">头像</TableHead>
              <TableHead class="table-cell-ellipsis">姓名</TableHead>
              <TableHead class="table-cell-ellipsis">邮箱</TableHead>
              <TableHead class="table-cell-ellipsis"> 操作 </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="collaborators in props.collaborators?.[0].collaborators" :key="collaborators.userId">
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
                <Avatar>
                  <AvatarImage :src="collaborators.profiles.image" alt="用户头像" />
                  <AvatarFallback>
                    {{ collaborators.profiles.name }}
                  </AvatarFallback>
                </Avatar>
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
                <ResponsePop title="移除成员" ref="responsePopRef">
                  <template #trigger>
                    <Button :disabled="isRemoving" variant="outline" size="icon">
                      <Icon icon="heroicons:trash" />
                    </Button>
                  </template>
                  <template #content>
                    <div>确定要移除该成员吗？</div>
                  </template>
                  <template #close>
                    <Button variant="outline">取消</Button>
                  </template>
                  <template #entry>
                    <Button @click="
                      removeCollaborator(
                        {
                          json: {
                            userId: collaborators.userId,
                            workspaceId: props.collaborators?.[0]
                              .id as string,
                          },
                        },
                        {
                          onSuccess: () => {
                            responsePopRef.value?.closeRef.value.click();
                            responsePopRef.value?.closeRef2.value.click();
                            queryClient.invalidateQueries({
                              queryKey: ['collaborators'],
                            });
                            toast.success('移除成员成功');
                          },
                          onError: () => {
                            toast.error('移除成员失败');
                          },
                        }
                      )
                      ">确定</Button>
                  </template>
                </ResponsePop>
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
