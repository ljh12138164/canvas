<script lang="ts" setup>
import { useMediaQuery } from '@vueuse/core'
import { Copy, Link, Trash } from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { computed, onBeforeMount, Ref, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Button } from '../ui/button'
import { Drawer, DrawerContent, DrawerOverlay, DrawerTrigger } from '../ui/drawer'
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
import { formItemList, FormType, type CreateFormItem, type FormItem } from '@/types/form'
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
const list1 = ref<CreateFormItem[]>(formItemList as CreateFormItem[])
const list2 = ref<CreateFormItem[]>([])
//   初始化赋值
const setList2 = (list: CreateFormItem[]) => (list2.value = list)
// 添加
const pushList2 = (item: CreateFormItem) => (list2.value = [...list2.value, item])
// 删除
const deleteList2 = (id: string) => (list2.value = list2.value.filter((item) => item.id !== id))
// 更新
const updateList2 = (
  id: string,
  type: FormType,
  newValue: string | boolean | number | undefined,
) => {
  list2.value = list2.value.map((item) => {
    if (item.id === id) {
      ;(item as any)[type] = newValue
    }
    return item
  })
}
onBeforeMount(async () => {
  const data = await getFormDataById(id.value + '')
  if (data) setList2(JSON.parse(data.schema))
})
const onOpen = ref(false)
const activeArea = ref<string>('')
const isMobile = useMediaQuery('(max-width: 768px)')

const [parent] = useAutoAnimate()
const onClone = (
  element: Record<
    'name' | 'id' | 'type' | 'isRequired' | 'placeholder' | 'defaultValue' | 'label',
    string
  >,
) => {
  const length = list2.value.filter((item: CreateFormItem) => item.type === element.type).length
  return {
    ...element,
    name: length ? `${element.name}(${length})` : element.name,
    defaultTypeName: length ? `${element.name}(${length})` : element.name,
    id: nanoid(),
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

// 更新组件到indexDB中
const handleUpdate = async () => {
  await indexDBChange({
    type: 'edit',
    editData: {
      id: id.value + '',
      schema: JSON.stringify(list2.value),
    },
  })
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
  deleteList2(id)
  activeArea.value = ''
  await handleUpdate()
}
watch(activeArea, () => {
  if (!activeArea.value) onOpen.value = false
  if (activeArea.value) onOpen.value = true
})

// 复制组件
const handleCopy = (id: string) => {
  const data = list2.value.find((item) => item.id === id)
  const nanoidId = nanoid()
  if (data) pushList2({ ...data, id: nanoidId })
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
        <Drawer v-model:open="onOpen">
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
              class="cursor-move h-50px rounded p-3 border relative hover:border-indigo-500 transition-all duration-300"
              :class="[activeArea === item.id ? 'bg-gray-500/20 border-indigo-500' : '']"
            >
              <DrawerTrigger as-child>
                <section>
                  <span> {{ item.name }} </span>

                  <div
                    v-if="activeArea === item.id"
                    @click.stop=""
                    class="absolute bg-indigo-600 p-[4px] top-[50%] cursor-pointer translate-y-[-50%] transition-all duration-300 translate-x-[-50%] right-[30px] rounded-full hover:bg-indigo-600/70"
                  >
                    <Copy @click="handleCopy(item.id)" class="w-4 h-4" />
                  </div>
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
                </section>
              </DrawerTrigger>
            </div>
          </VueDraggable>
          <DrawerContent
            v-if="isMobile"
            class="scrollbar-none h-[calc(100dvh-120px)] flex flex-col"
          >
            <FormItemConfig
              :updateList2="updateList2"
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
      <ScrollArea class="h-[calc(100dvh-120px)] pb-10 bg-gray-500/5" v-if="activeArea && !isMobile">
        <FormItemConfig
          :data="list2.find((item) => item.id === activeArea)"
          :updateList2="updateList2"
          :id="activeArea"
        />
      </ScrollArea>
    </div>
    <main class="flex justify-between">
      <!-- <preview-list class="w-full" :list="list1" />
      <preview-list class="w-full" :list="list2" /> -->
    </main>
  </section>
</template>
