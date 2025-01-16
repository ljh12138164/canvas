<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { nanoid } from 'nanoid'
import { getIndexDB, indexDBChange } from '@/lib'
import { onBeforeMount, ref } from 'vue'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
const previewList = ref<{ id: string; schema: string }[]>([])
onBeforeMount(async () => {
  previewList.value = await getIndexDB()
})
const handleDelete = async (id: string) => {
  await indexDBChange({ type: 'delete', deletItem: id })
  previewList.value = await getIndexDB()
}
</script>

<template>
  <div class="p-4">
    <section class="entry mb-8 w-full">
      <RouterLink :to="`/workspace/create/${nanoid()}`" class="w-full">
        <Button class="w-full">创建表单</Button>
      </RouterLink>
    </section>

    <section class="preview-list">
      <h2 class="text-xl font-bold mb-4">表单列表</h2>
      <div v-if="previewList.length" class="grid grid-cols-1 gap-4">
        <div
          v-for="item in previewList"
          :key="item.id"
          class="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer flex justify-between"
        >
          <RouterLink :to="`/workspace/create/${item.id}`">
            <div class="flex items-center justify-between">
              <span class="text-lg">表单 ID: {{ item.id }}</span>
            </div>
          </RouterLink>
          <Dialog>
            <DialogTrigger>
              <Button variant="destructive">删除</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>删除表单</DialogTitle>
              </DialogHeader>
              <DialogDescription> 确定要删除该表单吗？ </DialogDescription>
              <DialogFooter>
                <DialogClose>
                  <Button variant="outline">取消</Button>
                </DialogClose>
                <Button variant="destructive" @click="handleDelete(item.id)">删除</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div v-else class="text-center text-gray-500 py-8">暂无表单数据</div>
    </section>
  </div>
</template>
