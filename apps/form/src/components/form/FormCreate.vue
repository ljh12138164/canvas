<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { Link, Trash } from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { onBeforeMount, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Button } from '../ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer'
import { ScrollArea } from '../ui/scroll-area'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { useRoute, useRouter } from 'vue-router'
import FormItemConfig from './FormItemConfig.vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui/dialog'
import type { FormItem } from '@/types/form'
import { watch } from 'vue'
import { getFormDataById, getIndexDB, indexDBChange } from '@/lib/utils'
const closeRef = ref<HTMLButtonElement | null>(null)
const router = useRouter()
const route = useRoute()
const id = ref(route.params.id)
watch(
  () => route.params.id,
  (newId) => {
    id.value = newId
  },
)
// 组件列表
const list1 = ref<FormItem[]>([
  {
    name: '输入框',
    id: '1',
    type: 'input',
    isRequired: false,
    placeholder: '请输入',
    defaultValue: '',
  },
  {
    name: '单选框',
    id: '2',
    type: 'radio',
    isRequired: false,
    placeholder: '请选择',
    defaultValue: '',
  },
  {
    name: '多选框',
    id: '3',
    type: 'checkbox',
    isRequired: false,
    placeholder: '请选择',
    defaultValue: '',
  },
  {
    name: '下拉框',
    id: '4',
    type: 'select',
    isRequired: false,
    placeholder: '请选择',
    defaultValue: '',
  },
])
const list2 = ref<FormItem[]>([])
onBeforeMount(async () => {
  const data = await getFormDataById(id.value + '')
  if (data) {
    list2.value = JSON.parse(data.schema)
  }
})
const activeArea = ref<string>('')
const isMobile = useMediaQuery('(max-width: 768px)')

const [parent] = useAutoAnimate()
const onClone = (element: Record<'name' | 'id' | 'type', string>) => {
  const length = list2.value.filter((item) => item.type === element.type).length
  return {
    name: length ? `${element.name}(${length})` : element.name,
    id: nanoid(),
    type: element.type,
    isRequired: false,
    placeholder: '请输入',
    defaultValue: '',
  }
}
// 预览
const handlePreview = async () => {
  await indexDBChange({
    type: 'edit',
    editData: {
      id: id.value + '',
      schema: JSON.stringify(list2.value),
    },
  })
  router.push(`/preview/${id.value}`)
}
// 激活组件
const handleActiveArea = (id: string) => {
  if (activeArea.value === id) {
    activeArea.value = ''
  } else {
    activeArea.value = id
  }
}
// 删除组件
const handleDelete = async (id: string) => {
  list2.value = list2.value.filter((item) => item.id !== id)
  activeArea.value = ''
  await handleUpdate()
}
// 更新组件
const handleUpdate = async () => {
  await indexDBChange({
    type: 'edit',
    editData: {
      id: id.value + '',
      schema: JSON.stringify(list2.value),
    },
  })
}
// 更新表单单个组件
const handleUpdateItem = (id: string, data: FormItem) => {
  list2.value = list2.value.map((item) => (item.id === id ? data : item))
  handleUpdate()
}
</script>
<template>
  <section class="flex flex-col px-1 gap-2 w-full rounded h-[calc(100dvh-170px)] overflow-hidden">
    <div
      ref="parent"
      class="grid grid-cols-2 gap-2"
      v-auto-animate
      :class="{ 'grid-cols-3': activeArea && !isMobile }"
    >
      <ScrollArea class="h-[calc(100dvh-120px)] w-full bg-gray-500/5">
        <VueDraggable
          v-model="list1"
          :animation="150"
          style="scrollbar-width: none"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :sort="false"
          class="flex flex-col gap-2 p-4 w-300px bg-gray-500/5 rounded"
          :clone="onClone"
        >
          <div v-for="item in list1" :key="item.id" class="cursor-move h-50px rounded p-3 border">
            {{ item.name }}
          </div>
        </VueDraggable>
      </ScrollArea>
      <ScrollArea
        class="relative h-[calc(100dvh-170px)] pb-4 bg-gray-500/5 grid grid-rows-[1fr_20px]"
      >
        <Drawer>
          <DrawerTrigger as-child>
            <VueDraggable
              v-model="list2"
              :animation="150"
              :clone="onClone"
              :change="handleUpdate"
              style="scrollbar-width: none"
              group="people"
              class="flex min-h-[calc(100dvh-210px)] flex-col gap-2 p-4 w-300px m-auto bg-gray-500/5 rounded overflow-auto"
            >
              <div
                v-for="item in list2"
                :key="item.id"
                @click="handleActiveArea(item.id)"
                class="cursor-move h-50px rounded p-3 border relative"
                :class="[activeArea === item.id ? 'bg-gray-500/20 border-indigo-500' : '']"
              >
                <span> {{ item.name }} </span>
                <Dialog v-if="activeArea === item.id">
                  <DialogTrigger as-child>
                    <div
                      @click.stop=""
                      class="absolute bg-indigo-600 p-[4px] top-[50%] cursor-pointer translate-y-[-50%] transition-all duration-300 translate-x-[-50%] right-0 rounded-full hover:bg-indigo-600/70"
                    >
                      <Trash class="w-4 h-4" />
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle
                      >你确定要删除
                      <span class="text-red-500">{{ item.name }}</span> 吗？</DialogTitle
                    >
                    <DialogDescription> 删除后，该组件将不再显示在表单中 </DialogDescription>
                    <DialogFooter>
                      <DialogClose as-child>
                        <Button ref="closeRef" variant="outline"> 取消 </Button>
                      </DialogClose>
                      <Button @click="handleDelete(item.id)" variant="destructive"> 删除 </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </VueDraggable>
          </DrawerTrigger>
          <DrawerContent
            v-if="isMobile"
            class="scrollbar-none h-[calc(100dvh-120px)] flex flex-col"
          >
            <FormItemConfig
              :list="list2"
              :id="activeArea"
              :data="list2.find((item) => item.id === activeArea)"
            />
          </DrawerContent>
        </Drawer>

        <Button
          variant="outline"
          class="w-full hover:bg-white dark:hover:bg-gray-500/5 absolute bottom-0"
          @click="handlePreview"
        >
          <span
            class="text-sm flex items-center gap-2 hover:text-indigo-500/80 transition-all dark:hover:text-white"
          >
            <Link class="w-4 h-4" />
            <span>预览</span>
          </span>
        </Button>
      </ScrollArea>
      <ScrollArea class="h-[calc(100dvh-120px)] bg-gray-500/5" v-if="activeArea && !isMobile">
        <FormItemConfig
          :list="list2"
          :id="activeArea"
          :data="list2.find((item) => item.id === activeArea)"
        />
      </ScrollArea>
    </div>
    <main class="flex justify-between">
      <preview-list class="w-full" :list="list1" />
      <preview-list class="w-full" :list="list2" />
    </main>
  </section>
</template>
