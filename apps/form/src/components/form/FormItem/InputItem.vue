<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { FormItem } from '@/types/form'

const props = defineProps<{
  data: FormItem
}>()
</script>
<template>
  <section class="p-4">
    <header class="flex flex-col gap-2">
      <span>预览:</span>
      <Label :for="data.id" class="text-sm">{{ data.name }}</Label>
    </header>
    <Input :id="data.id" :default-value="data.defaultValue" :placeholder="data.placeholder" />
    <div>{{ data }}</div>
  </section>
</template>
