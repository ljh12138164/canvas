<script setup lang="ts">
import type { SubmitFormItem } from '@/types/form';
import ShowType from './ShowType.vue';

const props = defineProps<{
  // 提交的数据回显
  submit: Record<string, SubmitFormItem | Record<string, Record<string, SubmitFormItem>>>;
}>();
</script>
<template>
    <div v-for="item in Object.entries(props.submit)" :key="item[0]" class='my-2'>
        <!-- 子表单 -->
        <div v-if="!item[1].type">
            <!-- 子表单数据渲染 -->
            <p> 子表单:</p>
            <div v-for="child in Object.entries(item[1])" :key="child[0][0]">
                <ShowType :submit="child[1]" />
            </div>
        </div>
        <ShowType :submit="item[1] as SubmitFormItem" v-else />
    </div>
</template>
