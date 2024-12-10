<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createFiles } from '@/hooks/file';
import useUser from '@/store/user';
import { useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import * as z from 'zod';
import EmojiPopup from '../common/EmojiPopup.vue';
import { Input } from '../ui/input';
const formSchema = toTypedSchema(
  z.object({
    title: z.string().optional(),
    inconId: z.string().optional(),
  }),
);
const clinetQuery = useQueryClient();
const route = useRoute();
const workspaceId = ref(route.params.workspaceId as string);
const folderId = ref(route.params.folderId as string);
watch(
  () => route.params.workspaceId,
  () => {
    workspaceId.value = route.params.workspaceId as string;
  },
  { immediate: true },
);
watch(
  () => route.params.folderId,
  () => {
    folderId.value = route.params.folderId as string;
  },
  { immediate: true },
);
const token = useUser().userData?.session.access_token as string;
// const userId = useUser().userData?.session.user.id as string;
const { createFileIsPending, createFile } = createFiles(token);

const showEmoji = ref('');
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values) => {
  //校验
  if (!values.title) return form.setErrors({ title: '请输入文档名称' });
  if (values.title.length < 2)
    return form.setErrors({ title: '文档名称至少2个字符' });
  if (!values.inconId) return form.setErrors({ inconId: '请选择图标' });
  createFile(
    {
      json: {
        title: values.title,
        inconId: values.inconId,
        workspaceId: workspaceId.value,
        folderId: folderId.value,
        content: '',
      },
    },
    {
      onSuccess: () => {
        form.resetForm();
        clinetQuery.invalidateQueries({
          queryKey: ['workspaceItem'],
        });
        showEmoji.value = '';
      },
    },
  );
});
const onChangeEmoji = (emoji: string) => {
  form.setValues({ inconId: emoji });
  showEmoji.value = emoji;
};
</script>
<template>
  <form @submit="onSubmit" class="from">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem v-auto-animate>
        <FormLabel class="form-label">文件名称</FormLabel>
        <FormControl>
          <Input type="text" placeholder="文件名称" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="inconId">
      <FormItem class="form-item">
        <FormLabel class="form-label">文件图标</FormLabel>
        <FormControl>
          <EmojiPopup @onChangeEmoji="onChangeEmoji">
            <template #trigger>
              <Button type="button" class="emoji-button" variant="outline">
                <input class="emojiInput" type="text" v-bind="componentField" />
                <span v-if="showEmoji" class="emoji">{{ showEmoji }}</span>
                <span v-else>选择图标</span>
              </Button>
            </template>
          </EmojiPopup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button :disabled="createFileIsPending" type="submit">
      {{ createFileIsPending ? '创建中...' : '创建' }}
    </Button>
  </form>
</template>

<style scoped lang="scss">
.emojiInput {
  width: 0;
  display: none;
}
.emoji {
  font-size: 2em;
}
.form-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.emoji-button {
  margin: 0 !important;
}
.from {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  &-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
}
</style>
