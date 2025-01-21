<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateWorkspace } from '@/hooks/workspace';
import { toast } from '@/lib';
import useUser from '@/store/user';
import { useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as z from 'zod';
import EmojiPopup from '../common/EmojiPopup.vue';
import { CardFooter } from '../ui/card';
import { Input } from '../ui/input';
const router = useRouter();
const { createWorkspaceLoading, createWorkspace } = useCreateWorkspace();
const formSchema = toTypedSchema(
  z.object({
    title: z.string().optional(),
    inconId: z.string().optional(),
  }),
);
const queryClient = useQueryClient();
const showEmoji = ref('');
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values) => {
  //校验
  if (!values.title) return form.setErrors({ title: '请输入工作间名称' });
  if (values.title.length < 2) return form.setErrors({ title: '工作间名称至少2个字符' });
  if (!values.inconId) return form.setErrors({ inconId: '请选择图标' });
  createWorkspace(
    {
      json: {
        name: values.title,
        inconId: values.inconId,
      },
    },
    {
      onSuccess: (res) => {
        toast.dismiss();
        toast.success('创建成功');
        form.resetForm();
        showEmoji.value = '';
        router.push(`/workspace/${res.id}`);
        queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      },
      onError: () => {
        toast.dismiss();
        toast.error('创建失败');
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
  <form @submit="onSubmit" class="flex flex-col gap-4">
    <FormField v-slot="{ componentField }" name="inconId">
      <FormItem class="flex gap-2 items-center">
        <FormControl>
          <EmojiPopup @onChangeEmoji="onChangeEmoji">
            <template #trigger>
              <Button
                type="button"
                variant="outline"
                class="w-full h-[60px] bg-[#fff] dark:bg-[#272727] hover:bg-[#fff] dark:hover:bg-[#272727]"
              >
                <input
                  class="bg-[#fff] dark:bg-[#272727] emojiInput"
                  type="text"
                  v-bind="componentField"
                />
                <span v-if="showEmoji" class="emoji">{{ showEmoji }}</span>
                <span v-else class="text-muted-foreground">选择图标</span>
              </Button>
            </template>
          </EmojiPopup>
          <FormLabel style="margin-left: 10px; margin-top: 0">图标</FormLabel>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="title">
      <FormItem v-auto-animate>
        <FormLabel>工作间名称</FormLabel>
        <FormControl>
          <Input
            class="bg-[#fff] dark:bg-[#272727]"
            type="text"
            placeholder="工作间名称"
            v-bind="componentField"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <CardFooter as-child class="flex justify-end">
      <Button
        :disabled="createWorkspaceLoading"
        type="submit"
        class="w-[100px]"
      >
        {{ createWorkspaceLoading ? '创建中...' : '创建' }}
      </Button>
    </CardFooter>
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
</style>
