<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreVertical, Presentation, Trash2 } from 'lucide-vue-next'
import type { Form } from '@/types'
import { useRouter } from 'vue-router'
import { indexDBChange } from '@/lib/utils'
const router = useRouter()
const props = defineProps<{
  payment: Form
}>()
const handlePreview = async () => {
  await indexDBChange({
    type: 'edit',
    editData: {
      id: props.payment.id + '',
      schema: props.payment.schema,
    },
  })
  router.push(`/preview/${props.payment.id}`)
}
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="p-0 w-full">
        <MoreVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Button variant="ghost" class="p-0 w-full cursor-pointer" @click="handlePreview">
          <Presentation />
          <span>预览</span>
        </Button>
      </DropdownMenuItem>
      <DropdownMenuItem class="flex items-center gap-2" asChild>
        <Button variant="ghost" class="p-0 w-full cursor-pointer">
          <Trash2 />
          <span>删除</span>
        </Button>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
