<script setup lang="ts">
import ResponsePop from '@/components/common/ResponsePop.vue';
import { Button } from '@/components/ui/button';
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from '@/components/ui/pin-input';
import { useInviteCollaborator } from '@/hooks/collaborators';
import { toast } from '@/lib';
import { useQueryClient } from '@tanstack/vue-query';
import { ref, watch } from 'vue';

const queryClient = useQueryClient();
const props = defineProps<{
  token: string;
}>();
const { inviteCollaborator, isInviting } = useInviteCollaborator(props.token);
const value = ref<string[]>([]);
const handleComplete = (value: string) => {
  console.log(value);
};

watch(value, (value) => {
  if (value.length === 6) {
    toast.loading('加入中...');
    inviteCollaborator(
      { json: { inviteCode: value.join('') } },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success('加入成功');
          queryClient.invalidateQueries({ queryKey: ['collaborators'] });
        },
      },
    );
  }
});
</script>
<template>
  <ResponsePop title="邀请成员">
    <template #trigger>
      <Button variant="outline">加入成员</Button>
    </template>
    <template #content>
      <section
        class="flex flex-col gap-4 items-center h-[150px] justify-center"
      >
        <PinInput
          class="pin-input"
          id="pin-input"
          v-model="value"
          placeholder="○"
          :disabled="isInviting"
        >
          <PinInputGroup class="pin-input-group">
            <PinInputInput
              class="pin-input-input"
              v-for="(id, index) in 6"
              :key="id"
              :index="index"
              @complete="handleComplete"
            />
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
