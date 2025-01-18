<script setup lang="ts">
import Response from '@/components/common/Response.vue'
import FormPreviwe from '@/components/form/FormPreviwe.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { useBoard, useUpdateBoardInviteCode } from '@/hooks/board'
import { useQueryClient } from '@tanstack/vue-query'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { toast } = useToast()
const router = useRouter()
const route = useRoute()
const paramsId = ref<string>(route.params.id as string)
const { mutate: updateBoardInviteCode, isPending: isUpdateBoardInviteCodePending } =
  useUpdateBoardInviteCode()
const queryClient = useQueryClient()

watch(
  () => route.params.id,
  () => {
    paramsId.value = route.params.id as string
  },
  { immediate: true },
)
const { data, isLoading, error } = useBoard(paramsId.value)
const handleSubmit = (data: any) => {
  toast({
    title: data,
  })
}

const handleBack = () => {
  router.push('/workspace/form')
}

const handleCopy = () => {
  if (!data.value) return
  navigator.clipboard.writeText(data.value.inviteCode)
  toast({
    title: '复制成功',
  })
}

const handleRefresh = () => {
  if (!data.value) return
  queryClient.invalidateQueries({ queryKey: ['board'] })
  updateBoardInviteCode({
    json: {
      id: paramsId.value,
    },
  })
}
const inviteCode = computed(() => data.value?.inviteCode.split(''))
</script>

<template>
  <section v-if="isLoading" class="p-6">
    <div class="space-y-6">
      <Skeleton class="h-8 w-48" />
      <div class="space-y-4">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
        <Skeleton class="h-4 w-1/2" />
      </div>
    </div>
  </section>
  <section v-else-if="error" class="p-6">
    <div class="flex flex-col items-center justify-center space-y-4">
      <p class="text-red-500 text-lg">发生错误</p>
      <Button @click="handleBack">返回</Button>
    </div>
  </section>
  <ScrollArea v-else-if="data?.schema" class="p-6 max-h-[calc(100vh-110px)]">
    <Card class="mb-6">
      <CardContent class="pt-6">
        <section class="flex justify-between items-center mb-8">
          <h1 class="text-2xl font-semibold">{{ data.name || '表单详情' }}</h1>
          <Button variant="outline" size="sm" @click="handleBack">返回</Button>
        </section>
        <section class="grid grid-cols-2 gap-8">
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">表单名称</p>
            <p class="text-base">{{ data.name || '-' }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">表单描述</p>
            <p class="text-base">{{ data.description || '-' }}</p>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">表单创建时间</p>
            <p class="text-base">
              {{ dayjs(data.created_at).format('YYYY-MM-DD HH:mm:ss') || '-' }}
            </p>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">表单更新时间</p>
            <p class="text-base">
              {{ dayjs(data.update_at).format('YYYY-MM-DD HH:mm:ss') || '-' }}
            </p>
          </div>
        </section>
      </CardContent>
    </Card>
    <section class="py-4">
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>邀请码</CardTitle>
            <CardDescription> 邀请码是用于邀请他人填写表单的唯一标识码 </CardDescription>
          </CardHeader>
          <CardContent class="flex items-center justify-between gap-2">
            <PinInput id="pin-input" placeholder="○" v-model="inviteCode" disabled>
              <PinInputGroup>
                <PinInputInput
                  class="dark:bg-background w-full"
                  v-for="(id, index) in data.inviteCode.length"
                  :key="id"
                  :index="index"
                />
              </PinInputGroup>
            </PinInput>
            <Button variant="outline" size="sm" class="h-10 w-20" @click="handleCopy">
              复制
            </Button>
            <Response title="刷新邀请码">
              <template #trigger>
                <Button variant="outline" size="sm" class="h-10 w-20"> 刷新 </Button>
              </template>
              <template #content>
                <p>是否刷新邀请码</p>
              </template>
              <template #close>
                <Button variant="outline" size="sm" class="h-10 w-20"> 取消 </Button>
              </template>
              <template #enter>
                <Button
                  variant="outline"
                  size="sm"
                  class="h-10 w-20"
                  :disabled="isUpdateBoardInviteCodePending"
                  @click="handleRefresh"
                >
                  刷新
                </Button>
              </template>
            </Response>
          </CardContent>
        </CardContent>
      </Card>
    </section>
    <section class="py-4">
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>预览表单</CardTitle>
          </CardHeader>
          <FormPreviwe :schema="data.schema" @submit="handleSubmit" />
        </CardContent>
      </Card>
    </section>
  </ScrollArea>
</template>
