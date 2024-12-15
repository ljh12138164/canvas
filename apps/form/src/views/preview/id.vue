<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import * as z from 'zod'
const route = useRoute()
const id = ref(route.params.id)
watch(
  () => route.params.id,
  (newId) => {
    id.value = newId
  },
)
const localFormData = JSON.parse(localStorage.getItem(`formData:${id.value}`) || '[]')
const schema = z.object({
  username: z
    .string({
      required_error: 'Username is required.',
    })
    .min(2, {
      message: 'Username must be at least 2 characters.',
    }),
})

const fieldConfig = {
  password: {
    label: 'Your secure password',
    inputProps: {
      type: 'password',
      placeholder: '••••••••',
    },
  },
  favouriteNumber: {
    description: 'Your favourite number between 1 and 10.',
  },
  acceptTerms: {
    label: 'Accept terms and conditions.',
    inputProps: {
      required: true,
    },
  },

  birthday: {
    description: 'We need your birthday to send you a gift.',
  },

  sendMeMails: {
    component: 'switch',
  },

  bio: {
    component: 'textarea',
  },

  marshmallows: {
    label: 'How many marshmallows fit in your mouth?',
    component: 'radio',
  },

  file: {
    label: 'Text file',
    component: 'file',
  },
}
</script>

<template>
  <ScrollArea class="h-[calc(100dvh-120px)] flex px-10 overflow-hidden">
    <AutoForm
      class="w-full space-y-6"
      :schema="schema"
      :field-config="fieldConfig as any"
      v-if="localFormData"
    />
    <div v-else>
      <p>暂无数据</p>
    </div>
  </ScrollArea>
</template>
