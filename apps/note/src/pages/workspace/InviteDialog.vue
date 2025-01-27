<script setup lang="ts">
// @ts-nocheck
import ResponsePop from '@/components/common/ResponsePop.vue';
import { Button } from '@/components/ui/button';
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input';
import { useInviteCollaborator } from '@/hooks/collaborators';
import { toast } from '@/lib';
import { useQueryClient } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const queryClient = useQueryClient();

const { inviteCollaborator, isInviting } = useInviteCollaborator();
const valueString = ref<string[]>([]);
watch(valueString, (value) => {
  if (value.length === 6) {
    toast.loading('加入中...');
    inviteCollaborator(
      { json: { inviteCode: value.join('') } },
      {
        onSuccess: (data) => {
          toast.dismiss();
          toast.success('加入成功');
          queryClient.invalidateQueries({ queryKey: ['collaborators'] });
          queryClient.invalidateQueries({ queryKey: ['workspaces'] });
          router.push(`/workspace/${data.id}`);
          valueString.value = [];
        },
        onError: (error) => {
          toast.dismiss();
          setTimeout(() => {
            toast.error(error.message);
          }, 1000);
        },
      },
    );
  }
});
</script>
<template>
  <ResponsePop title="工作区邀请码">
    <template #trigger>
      <Button>加入工作区</Button>
    </template>
    <template #content>
      <section class="flex flex-col gap-4 items-center h-[150px] justify-center">
        <PinInput class="pin-input" id="pin-input" v-model="valueString" placeholder="○" :disabled="isInviting">
          <PinInputGroup class="pin-input-group">
            <PinInputInput class="pin-input-input" v-for="(id, index) in 6" :key="id" :index="index" />
          </PinInputGroup>
        </PinInput>
      </section>
    </template>
  </ResponsePop>
</template>
<style scoped lang="scss">
.pin-input {
  width: 100%;
}

.pin-input-input {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  border: 1px solid #e0e0e0;
}

.pin-input-group {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}
</style>
