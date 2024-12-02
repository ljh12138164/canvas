<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import EmojiPick from '@/components/emoji/EmojiPick.vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';

const formSchema = toTypedSchema(
  z.object({
    title: z.string({ required_error: '请输入工作间名称' }).min(2).max(50),
    inconId: z.string({ required_error: '请输入图标' }),
  })
);
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values);
});
</script>
<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem v-auto-animate>
        <FormLabel>工作间名称</FormLabel>
        <FormControl>
          <Input type="text" placeholder="工作间名称" v-bind="componentField" />
        </FormControl>
        <FormDescription> 工作间名称 </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="inconId">
      <FormItem v-auto-animate>
        <FormLabel>图标</FormLabel>
        <FormControl>
          <EmojiPick v-bind="componentField" />
        </FormControl>
        <FormDescription> 图标 </FormDescription>

        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit"> 创建 </Button>
  </form>
</template>

<style scoped></style>
