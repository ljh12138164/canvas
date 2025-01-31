                    
<script setup lang="ts">
import Show from '@/components/form/Submit/Show.vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMySubmitById } from '@/hooks/submit';
import dayjs from 'dayjs';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = ref(route.params.id);
watch(
  () => route.params.id,
  (newId) => {
    id.value = newId;
  },
);
const { data: submit, isLoading, error } = useGetMySubmitById(id.value as string);
</script>
<template>
    <ScrollArea class="h-[calc(100dvh-120px)]">
        <section v-if="isLoading">
            <Skeleton class="h-10 w-full" />
        </section>
        <section v-else-if="submit">
            <Card>
                <CardHeader>
                    <CardTitle class="text-center">表单标题：{{ submit.form.name }}</CardTitle>
                    <CardDescription class="text-center">提交时间：{{ dayjs(submit.created_at).format('YYYY年MM月DD日 HH:mm:ss')
                        }}</CardDescription>
                </CardHeader>
                <CardContent>
                    <!-- 提交数据渲染 -->
                    <section>
                        提交时间：{{ dayjs(submit.created_at).format('YYYY年MM月DD日 HH:mm:ss') }}
                    </section>
                    <section>
                        <Show :submit="JSON.parse(submit.submit)" />
                    </section>
                </CardContent>
            </Card>
        </section>
        <section v-else-if="error">
            <p>提交不存在</p>
        </section>
    </ScrollArea>
</template>
