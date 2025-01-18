<template>
  <ScrollArea class="w-full h-[calc(100dvh-100px)]">
    <section v-if="isLoading">
      <div class="space-y-4">
        <!-- 标题骨架 -->
        <Skeleton class="h-8 w-3/4" />

        <!-- 表单项骨架 -->
        <div class="space-y-6">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <Skeleton class="h-4 w-1/4" />
            <Skeleton class="h-10 w-full" />
          </div>
        </div>
      </div>
    </section>

    <section
      v-else-if="error"
      class="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-1"
    >
      <div class="text-center">加载失败，请稍后重试</div>
      <Button @click="router.back()">返回</Button>
    </section>

    <section v-else-if="data?.schema">
      <FormPreviwe :schema="data?.schema" @submit="submit" class-name="min-h-[calc(100vh-100px)]" />
    </section>
    <section
      v-else-if="error"
      class="flex h-[calc(100vh-100px)] flex-col items-center justify-center gap-1"
    >
      <div class="text-center">无数据</div>
      <Button @click="router.back()">返回</Button>
    </section>
  </ScrollArea>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useGetInviteCodeData } from '@/hooks/board'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import FormPreviwe from '@/components/form/FormPreviwe.vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/lib'

const router = useRouter()
const inviteCode = useRoute().params.inviteCode as string
const { data, isLoading, error } = useGetInviteCodeData(inviteCode)
const submit = (data: any) => {
  console.log(data)
  toast.success('提交成功')
  router.push(`/workspace/board`)
}
</script>
