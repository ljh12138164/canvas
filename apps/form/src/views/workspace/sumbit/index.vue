<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input'
import { useToast } from '@/components/ui/toast/use-toast'
import { Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { toast } = useToast()
const loading = ref(false)
const code = ref<string[]>([])

const handleSubmit = () => {
  if (code.value.length !== 6) return
  toast({
    title: '加入成功',
    description: '正在跳转到表单...',
  })
  router.push(`/workspace/submit/${code.value.join('')}`)
}
</script>
<template>
  <div class="flex h-full items-center justify-center bg-background p-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>表单提交</CardTitle>
        <CardDescription>请输入邀请码提交表单</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-4">
            <Label for="code">邀请码</Label>
            <PinInput id="pin-input" v-model="code" placeholder="○">
              <PinInputGroup>
                <PinInputInput
                  class="dark:bg-background w-full"
                  v-for="(id, index) in 6"
                  :key="id"
                  :index="index"
                />
              </PinInputGroup>
            </PinInput>
            <Button :disabled="loading || code.length !== 6" type="submit" class="w-full">
              <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
              {{ loading ? '加入中...' : '加入' }}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
