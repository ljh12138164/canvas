<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SubmitFormItem } from '@/types/form';
import ShowType from './ShowType.vue';

const props = defineProps<{
  // 提交的数据回显
  submit: Record<string, SubmitFormItem | Record<string, Record<string, SubmitFormItem>>>;
}>();
</script>
<template>
    <div v-for="item in Object.entries(props.submit)" :key="item[0]" class='my-4'>
        <!-- 子表单 -->
        <Card v-if="!item[1].type">
            <!-- 子表单数据渲染 -->
            <CardHeader>
                <CardTitle>子表单:</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-for="child in Object.entries(item[1])" :key="child[0][0]">
                    <ShowType :submit="child[1]" />
                </div>
            </CardContent>
        </Card>
        <ShowType :submit="item[1] as SubmitFormItem" v-else />
    </div>
</template>
