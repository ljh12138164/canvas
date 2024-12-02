<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ref } from "vue";
import * as z from "zod";
import EmojiPopup from "../common/EmojiPopup.vue";
import { Input } from "../ui/input";
import { CardFooter } from "../ui/card";
import { useCreateWorkspace } from "@/hooks/workspace";
import useUser from "@/store/user";
const { userData } = useUser();
const token = userData?.session.access_token as string;
const { createWorkspaceLoading, createWorkspace } = useCreateWorkspace(token);
const formSchema = toTypedSchema(
  z.object({
    title: z.string().optional(),
    inconId: z.string().optional(),
  })
);
const showEmoji = ref("");
const form = useForm({
  validationSchema: formSchema,
});
const onSubmit = form.handleSubmit((values) => {
  //校验
  if (!values.title) return form.setErrors({ title: "请输入工作间名称" });
  if (values.title.length < 2)
    return form.setErrors({ title: "工作间名称至少2个字符" });
  if (!values.inconId) return form.setErrors({ inconId: "请选择图标" });
  createWorkspace(
    {
      json: {
        name: values.title,
        inconId: values.inconId,
      },
    },
    {
      onSuccess: () => {
        form.resetForm();
        showEmoji.value = "";
      },
    }
  );
});
const onChangeEmoji = (emoji: string) => {
  form.setValues({ inconId: emoji });
  showEmoji.value = emoji;
};
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
      <FormItem>
        <FormLabel>图标</FormLabel>
        <FormControl>
          <EmojiPopup @onChangeEmoji="onChangeEmoji">
            <template #trigger>
              <Button type="button" variant="outline">
                <input class="emojiInput" type="text" v-bind="componentField" />
                <span v-if="showEmoji" class="emoji">{{ showEmoji }}</span>
                <span v-else>选择图标</span>
              </Button>
            </template>
          </EmojiPopup>
        </FormControl>
        <FormDescription> 图标 </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>
    <CardFooter>
      <Button :disabled="createWorkspaceLoading" type="submit">
        {{ createWorkspaceLoading ? "创建中..." : "创建" }}
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
