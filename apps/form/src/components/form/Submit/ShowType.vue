<script setup lang="ts">
import FileList from '@/components/common/FileList.vue';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FileType, SubmitFormItem } from '@/types/form';
defineProps<{
  submit: SubmitFormItem;
}>();
</script>
<template>
    <!-- {{ submit }} -->
    <Card v-if="submit.type === 'input'">
        <CardHeader>
            <CardTitle>输入框: <span class="text-xl " v-if="!submit.hiddenLabel">{{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <span>{{ submit.SubmitValue ?? '--' }}</span>
        </CardContent>
    </Card>
    <Card v-else-if="submit.type === 'select'">
        <CardHeader>
            <CardTitle>下拉框: <span class="text-xl " v-if="!submit.hiddenLabel"> {{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <span>{{ submit.SubmitValue ?? '--' }}</span>
        </CardContent>
    </Card>
    <Card v-else-if="submit.type === 'radio'">
        <CardHeader>
            <CardTitle>单选框: <span class="text-xl " v-if="!submit.hiddenLabel"> {{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <span>{{ submit.SubmitValue ?? '--' }}</span>
        </CardContent>
    </Card>
    <Card v-else-if="submit.type === 'date'">
        <CardHeader>
            <CardTitle>日期选择器: <span class="text-xl " v-if="!submit.hiddenLabel"> {{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <span>{{ submit.SubmitValue ?? '--' }}</span>
        </CardContent>
    </Card>
    <Card v-else-if="submit.type === 'slider'">
        <CardHeader>
            <CardTitle>滑动按钮: <span class="text-xl " v-if="!submit.hiddenLabel"> {{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <span>{{ submit.SubmitValue ?? '--' }}</span>
        </CardContent>
    </Card>
    <Card v-else-if="submit.type === 'file'">
        <CardHeader>
            <CardTitle>文件: <span class="text-xl " v-if="!submit.hiddenLabel"> {{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <FileList :sumbit="submit as FileType" v-if="(submit as FileType).file" />
            <span v-else>--</span>
        </CardContent>
    </Card>
    <Card v-else-if="submit.type === 'bigText'">
        <CardHeader>
            <CardTitle>大文本: <span class="text-xl " v-if="!submit.hiddenLabel"> {{ submit.label }}</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <span>{{ submit.SubmitValue ?? '--' }}</span>
        </CardContent>
    </Card>
</template>
