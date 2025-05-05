<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { useCreateBoard, useUpdateBoardSchema } from '@/hooks/board';
import { getFormDataById, indexDBChange } from '@/lib/index';
import { type CreateFormItem, type FormType, type ObjectItem, formItemList } from '@/types/form';
import { useAutoAnimate } from '@formkit/auto-animate/vue';
import type { DateValue } from '@internationalized/date';
import { useQueryClient } from '@tanstack/vue-query';
import { toTypedSchema } from '@vee-validate/zod';
import { useMediaQuery } from '@vueuse/core';
import { ArrowLeft, Copy, Link, Trash } from 'lucide-vue-next';
import { Save } from 'lucide-vue-next';
import { nanoid } from 'nanoid';
import { useField, useForm } from 'vee-validate';
import { onBeforeMount, ref, watch } from 'vue';
import { onMounted } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useRoute, useRouter } from 'vue-router';
import * as z from 'zod';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import FormArrayConfig from './FormArrayConfig.vue';
import FormItemConfig from './FormItemConfig.vue';
const queryClient = useQueryClient();
const { toast } = useToast();
const route = useRoute();
const id = ref(route.params.id);
const props = defineProps<{
  schema?: string;
  id?: string;
  title?: string;
  description?: string;
}>();
const { mutate: createBoard } = useCreateBoard();
// 提交的表单数据
// const schema = ref<z.ZodObject<any, any, any, any>[]>([])

const closeRef = ref<HTMLButtonElement | null>(null);
const router = useRouter();

watch(
  () => route.params.id,
  (newId) => {
    id.value = newId;
  },
);

// 组件列表
// @ts-ignore
const list1 = ref<CreateFormItem[]>(formItemList as CreateFormItem[]);
const list2 = ref<CreateFormItem[]>([]);
const subId = ref<string[]>([]);
const { mutate: updateBoardSchema, isPending: isUpdateBoardSchemaPending } = useUpdateBoardSchema();

//   初始化赋值
const setList2 = (list: CreateFormItem[]) => {
  list2.value = list;
};
// 添加
const pushList2 = (item: CreateFormItem) => {
  list2.value = [...list2.value, item];
};
// 删除
const deleteList2 = (id: string) => {
  list2.value = list2.value.filter((item) => item.id !== id);
};
// 更新
const updateList2 = async (
  id: string,
  type: FormType,
  newValue: string | boolean | number | undefined | { name: string; id: string }[] | DateValue,
) => {
  list2.value = list2.value.map((item) => {
    if (item.id === id) {
      (item as any)[type] = newValue;
    }
    return item;
  });
  await handleUpdate();
};
const updateArray = async (
  id: string[],
  type: FormType,
  newValue: string | boolean | number | undefined | { name: string; id: string }[] | DateValue,
) => {
  // 更新数组
  list2.value = list2.value.map((item) => {
    if (item.id === id[0]) {
      (item as ObjectItem)?.children.map((items: CreateFormItem) => {
        if (items.id === id[1]) {
          (items as any)[type] = newValue;
        }
        return items;
      });
    }
    return item;
  });
  await handleUpdate();
};
const isSave = ref(false);
onBeforeMount(async () => {
  const data = await getFormDataById(id.value as string);
  // 读取indexDB中的数据
  if (!props.schema) {
    if (data) setList2(JSON.parse(data.schema));
  } else {
    if (data) {
      setList2(JSON.parse(data.schema));
      isSave.value = true;
    } else {
      setList2(JSON.parse(props.schema));
      isSave.value = false;
    }
  }
});
const onOpen = ref(false);
const activeArea = ref<string>('');
const isMobile = useMediaQuery('(max-width: 768px)');

const [parent] = useAutoAnimate();
const onClone = (
  element: Record<
    | 'name'
    | 'id'
    | 'type'
    | 'isRequired'
    | 'placeholder'
    | 'defaultValue'
    | 'label'
    | 'options'
    | 'hiddenLabel'
    | 'description'
    | 'defaultValue'
    | 'defaultTypeName',
    string
  >,
) => {
  const existingNames = new Set(
    list2.value
      .filter((item: CreateFormItem) => item.type === element.type)
      .map((item) => item.name),
  );
  for (const item of list2.value) {
    if (item.type === 'obj') {
      for (const child of item.children) {
        existingNames.add(child.name);
      }
    }
  }
  const baseName = element.name;
  let newName = baseName;
  let counter = 1;
  while (existingNames.has(newName)) {
    newName = `${baseName}(${counter})`;
    counter++;
  }

  return {
    ...element,
    name: newName,
    defaultTypeName: newName,
    id: nanoid(),
  };
};
// 预览
const handlePreview = async () => {
  await indexDBChange({
    type: 'edit',
    editData: {
      id: `${id.value}`,
      schema: JSON.stringify(list2.value),
    },
  });
  router.push(`/workspace/create/preview/${id.value}`);
};

// 更新组件到indexDB中
const handleUpdate = async () => {
  await indexDBChange({
    type: 'edit',
    editData: {
      id: `${id.value}`,
      schema: JSON.stringify(list2.value),
    },
  });
};

const parentHandleUpdate = () => {};
// 激活组件
const handleActiveArea = (id: string) => {
  if (activeArea.value === id) {
    activeArea.value = '';
  } else {
    activeArea.value = id;
  }
};

// 激活子组件
const handleActiveSub = (id: string, fatherId: string) => {
  if (subId.value.includes(id)) {
    subId.value = [];
  } else {
    subId.value = [fatherId, id];
  }
};

// 删除组件
const handleDelete = async (id: string) => {
  deleteList2(id);
  activeArea.value = '';
  subId.value = [];
  await handleUpdate();
};
watch(activeArea, () => {
  if (subId.value.length) return;
  if (!activeArea.value) onOpen.value = false;
  if (activeArea.value) onOpen.value = true;
});
watch(subId, () => {
  if (activeArea.value) return;
  if (!subId.value.length) onOpen.value = false;
  if (subId.value.length) onOpen.value = true;
});
// 复制组件
const handleCopy = async (id: string) => {
  const data = list2.value.find((item) => item.id === id);
  const nanoidId = nanoid();
  if (data) pushList2({ ...data, id: nanoidId });
  await handleUpdate();
};
const parmasClone = (
  element: Record<
    | 'name'
    | 'id'
    | 'type'
    | 'isRequired'
    | 'placeholder'
    | 'defaultValue'
    | 'label'
    | 'options'
    | 'hiddenLabel'
    | 'description'
    | 'defaultValue'
    | 'defaultTypeName',
    string
  >,
) => {
  if (element.type === 'obj') return;
  return element;
};
// 拖拽组件
const datas = ref<CreateFormItem | undefined>(undefined);

watch(activeArea, () => {
  if (activeArea.value) {
    subId.value = [];
    datas.value = list2.value.find((item) => item.id === activeArea.value);
  }
});
watch(subId, () => {
  if (subId.value.length) {
    activeArea.value = '';
    datas.value = (
      list2.value.find((item) => item.id === subId.value[0]) as ObjectItem
    )?.children.find((item: CreateFormItem) => item.id === subId.value[1]);
  }
});

///////////////表单提交
// 定义表单验证架构
const validationSchema = toTypedSchema(
  z.object({
    title: z.coerce.string().min(2, '标题至少需要2个字符').max(50, '标题不能超过50个字符'),
    description: z.string().max(200, '描述不能超过200个字符').optional(),
  }),
);

// 使用vee-validate的useForm和useField
const { handleSubmit, resetForm, errors } = useForm({
  validationSchema,
  initialValues: {
    title: props.title || '',
    description: props.description || '',
  },
});

// 获取字段
const { value: title } = useField<string>('title');
const { value: description } = useField<string>('description');

// 提交处理函数
const onSubmit = handleSubmit((values) => {
  if (!list2.value.length) {
    toast({
      title: '请先填写表单',
      variant: 'destructive',
    });
    return;
  }
  if (!props.schema) {
    createBoard(
      {
        json: {
          id: nanoid(),
          name: values.title,
          schema: JSON.stringify(list2.value),
          description: values.description,
        },
      },
      {
        onSuccess: async (data) => {
          toast({ title: '创建成功' });
          await indexDBChange({ type: 'delete', deletItem: id.value as string });
          queryClient.invalidateQueries({ queryKey: ['board'] });
          // 细节
          router.push(`/workspace/form/detail/${data.id}`);
        },
      },
    );
  } else {
    // 更新
  }
});
const handleUpdateBoardSchema = () => {
  if (!list2.value.length) {
    toast({
      title: '请先填写表单',
      variant: 'destructive',
    });
    return;
  }
  updateBoardSchema(
    {
      json: {
        id: props.id as string,
        schema: JSON.stringify(list2.value),
      },
    },
    {
      onSuccess: async () => {
        toast({ title: '保存成功' });
        // 删除本地indexDB中的数据
        await indexDBChange({ type: 'delete', deletItem: id.value as string });
        queryClient.invalidateQueries({ queryKey: ['formDetail', id.value as string] });
        // 跳转
        router.push(`/workspace/form/detail/${id.value}`);
      },
    },
  );
};

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      handleUpdateBoardSchema();
    }
    if (e.key === 'v' && e.ctrlKey) {
      e.preventDefault();
      // 复制
      if (datas.value) {
        // @ts-ignore
        pushList2(onClone(datas.value));
        handleUpdate();
      }
    }
  });
});
</script>
<template>
  <nav class="flex items-center justify-between  pb-2 ">
    <Button variant="outline" @click="router.back()">
      <ArrowLeft class="w-4 h-4" />
      <span>返回</span>
    </Button>
  </nav>
  <section class="flex flex-col px-1 gap-2 w-full rounded h-[calc(100dvh-230px)] overflow-hidden">
    <div ref="parent" class="grid grid-cols-2 gap-2" v-auto-animate
      :class="{ 'grid-cols-3': (activeArea || subId.length) && !isMobile }">
      <!-- 左 -->
      <ScrollArea class="h-[calc(100dvh-250px)] w-full bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <VueDraggable v-model="list1" :animation="150" style="scrollbar-width: none"
          :group="{ name: 'people', pull: 'clone', put: false }" :sort="false" class="flex flex-col gap-3 p-4 w-full"
          :clone="onClone">
          <div v-for="item in list1" :key="item.id"
            class="cursor-move rounded-md p-4 border border-gray-200 dark:border-gray-800 hover:border-primary hover:shadow-xs transition-all duration-200 bg-white dark:bg-gray-800/50 flex items-center gap-2">
            <component :is="item.icon" class="w-4 h-4 text-gray-500" />
            <span class="text-sm">{{ item.name }}</span>
          </div>
        </VueDraggable>
      </ScrollArea>
      <!-- 中 -->
      <ScrollArea class="relative pb-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
        <Drawer v-model:open="onOpen">
          <VueDraggable v-model="list2" :animation="150" :clone="parmasClone" :change="handleUpdate"
            style="scrollbar-width: none" group="people"
            class="flex h-[calc(100dvh-300px)] flex-col gap-3 p-4 w-full m-auto rounded-lg">
            <div v-for="item in list2" :key="item.id" @click="handleActiveArea(item.id)"
              class="cursor-move rounded-md p-4 border border-gray-200 dark:border-gray-800 relative transition-all duration-200 bg-white dark:bg-gray-800/50"
              :class="[
                'hover:border-primary hover:shadow-xs',
                activeArea === item.id && item.type !== 'obj'
                  ? 'border-primary bg-primary/5'
                  : ''
              ]">
              <DrawerTrigger as-child>
                <section>
                  <span v-if="item.type !== 'obj'">
                    {{ item.name }}
                  </span>
                  <div v-else-if="item.type === 'obj'" @click.stop="handleActiveArea(item.id)">
                    <p>{{ item.name }}</p>
                    <VueDraggable v-model="item.children" :animation="150" :clone="parmasClone"
                      :change="parentHandleUpdate" style="scrollbar-width: none" group="people"
                      class="flex flex-col gap-2 p-4 w-300px m-auto bg-gray-500/5 rounded overflow-auto">
                      <div v-for="el in item.children" :key="el.name" @click.stop="handleActiveSub(el.id, item.id)"
                        :class="[
                          subId.includes(el.id)
                            ? 'bg-gray-500/20 border-indigo-500'
                            : ''
                        ]"
                        class="cursor-move h-50px rounded p-3 border relative hover:border-indigo-500 transition-all duration-300">
                        <p>{{ el.name }}</p>
                      </div>
                    </VueDraggable>
                  </div>
                  <div v-if="activeArea === item.id" @click.stop=""
                    class="absolute bg-indigo-600 p-[4px] cursor-pointer translate-y-[-50%] transition-all duration-300 translate-x-[-50%] right-[30px] rounded-full hover:bg-indigo-600/70"
                    :class="[
                      `${item.type !== 'obj' ? 'top-[50%]' : 'top-[15%]'}`
                    ]">
                    <Copy @click="handleCopy(item.id)" class="w-4 h-4 text-white " />
                  </div>
                  <Dialog v-if="activeArea === item.id">
                    <DialogTrigger as-child>
                      <div @click.stop=""
                        class="absolute bg-indigo-600 p-[4px] cursor-pointer translate-y-[-50%] transition-all duration-300 translate-x-[-50%] right-0 rounded-full hover:bg-indigo-600/70"
                        :class="`${item.type !== 'obj' ? 'top-[50%]' : 'top-[15%]'}`
                          ">
                        <Trash class="w-4 h-4 text-white " />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>你确定要删除
                        <span class="text-red-500">{{ item.name }}</span>
                        吗？
                      </DialogTitle>
                      <DialogDescription>
                        删除后，该组件将不再显示在表单中
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose as-child>
                          <Button ref="closeRef" variant="outline">
                            取消
                          </Button>
                        </DialogClose>
                        <Button @click="handleDelete(item.id)" variant="destructive">
                          删除
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </section>
              </DrawerTrigger>
            </div>
          </VueDraggable>
          <DrawerContent v-if="isMobile" class="scrollbar-none h-[calc(100dvh-120px)] flex flex-col">
            <ScrollArea class="h-full pb-10 bg-gray-500/5" v-if="activeArea">
              <FormItemConfig :data="datas" :updateList2="updateList2" :id="activeArea" />
            </ScrollArea>
            <ScrollArea class="h-full pb-10 bg-gray-500/5" v-if="subId.length">
              <FormArrayConfig :data="datas" :list2="list2" :updateList="updateArray" :id="subId" />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
        <RouterLink :to="`/workspace/create/preview/${id}`">
          <Button variant="outline" class="w-full hover:bg-white dark:hover:bg-gray-500/5 absolute bottom-0"
            @click="handlePreview">
            <span class="text-sm flex items-center gap-2 hover:text-indigo-500/80 transition-all dark:hover:text-white">
              <Link class="w-4 h-4" />
              <span>预览</span>
            </span>
          </Button>
        </RouterLink>
      </ScrollArea>
      <!-- 右 -->
      <ScrollArea class="h-[calc(100dvh-250px)] pb-10 bg-gray-500/5" v-if="activeArea && !isMobile">
        <FormItemConfig :data="datas" :updateList2="updateList2" :id="activeArea" />
      </ScrollArea>
      <ScrollArea class="h-[calc(100dvh-250px)] pb-10 bg-gray-500/5" v-if="subId.length && !isMobile">
        <FormArrayConfig :data="datas" :updateList="updateArray" :id="subId" />
      </ScrollArea>
    </div>
  </section>
  <Dialog v-if="!schema">
    <DialogTrigger as-child>
      <Button variant="outline" class="w-full">
        <Save class="mr-2 h-4 w-4" />
        <span> 保存</span>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>填写表单信息</DialogTitle>
        <form @submit="onSubmit" class="space-y-4 mt-4">
          <div class="space-y-2">
            <label for="title" class="text-sm font-medium">标题</label>
            <Input v-model="title" name="title" type="text" class="w-full px-3 py-2 border rounded-md"
              placeholder="请输入表单标题" />
            <span v-if="errors.title" class="text-sm text-red-500">{{
              errors.title
              }}</span>
          </div>
          <div class="space-y-2">
            <label for="description" class="text-sm font-medium">描述</label>
            <Textarea v-model="description" name="description" class="w-full px-3 py-2 border rounded-md"
              placeholder="请输入表单描述" rows="3" />
            <span v-if="errors.description" class="text-sm text-red-500">{{
              errors.description
              }}</span>
          </div>
        </form>
      </DialogHeader>
      <DialogFooter>
        <Button type="submit" @click="onSubmit">创建</Button>
        <DialogClose>
          <Button variant="ghost" @click="resetForm">取消</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <Button variant="outline" class="w-full" v-else @click="handleUpdateBoardSchema"
    :disabled="isUpdateBoardSchemaPending">
    <Save class="mr-2 h-4 w-4" />
    <span>{{ isUpdateBoardSchemaPending ? "保存中..." : "保存" }}</span>
  </Button>
</template>
<style scoped>
.drag-area {
  min-height: 50px;
  border: 1px dashed var(--border-color);
  border-radius: 6px;
}

:root {
  --border-color: #e5e7eb;
}

.dark {
  --border-color: #374151;
}
</style>
