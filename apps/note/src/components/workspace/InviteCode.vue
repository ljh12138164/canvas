<script setup lang="ts">
import { toast } from '@/lib';
import type { CollaboratorsData } from '@/types/collaborators';
import { Icon } from '@iconify/vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from '../ui/button';
import { CardContent, CardHeader, CardTitle } from '../ui/card';
import Card from '../ui/card/Card.vue';
import { PinInput, PinInputGroup, PinInputInput } from '../ui/pin-input';
import { Skeleton } from '../ui/skeleton';
const router = useRouter();

const props = defineProps<{
  collaborators: CollaboratorsData[] | undefined;
  isLoading: boolean;
}>();
watch(
  () => props.collaborators,
  (newVal) => {
    if (!props.isLoading && newVal?.length === 0) {
      toast.error('未找到工作区');
      router.push('/workspace');
    }
  },
);
const value = ref<string[]>(
  props.collaborators?.[0].inviteCode?.split('') || [],
);
const handleCopy = () => {
  toast.dismiss();
  toast.success('复制成功');
  navigator.clipboard.writeText(props.collaborators?.[0].inviteCode || '');
};
watch(
  () => props.collaborators?.[0].inviteCode,
  (newVal) => {
    value.value = newVal?.split('') || [];
  },
);
</script>
<template>
  <Card v-if="!props.isLoading">
    <CardHeader>
      <CardTitle>邀请码</CardTitle>
    </CardHeader>
    <CardContent>
      <section class="invite-code-container" v-if="collaborators?.length">
        <PinInput
          class="pin-input"
          id="pin-input"
          v-model="value"
          placeholder="○"
          disabled
        >
          <PinInputGroup class="pin-input-group">
            <PinInputInput
              class="pin-input-input"
              v-for="(id, index) in 6"
              :key="id"
              :index="index"
            />
          </PinInputGroup>
        </PinInput>
        <Button
          variant="outline"
          @click="handleCopy"
          class="pin-input-input ml-2"
        >
          <Icon icon="heroicons:clipboard-document-list" />
        </Button>
      </section>
      <section v-else>
        <div>未找到工作区</div>
      </section>
    </CardContent>
  </Card>
  <Skeleton class="skeleton" v-else />
</template>

<style scoped lang="scss">
.invite-code-container {
  display: flex;
  justify-content: center;
}
.skeleton {
  width: 100%;
  height: 100px;
  border-radius: 10px;
}
.pin-input {
  width: 100%;
}
.pin-input-group {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0.5;
}
.pin-input-input {
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
}
</style>
