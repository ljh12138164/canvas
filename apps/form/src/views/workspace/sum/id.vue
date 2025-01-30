<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetSubmitFormById } from '@/hooks/submit';
import dayjs from 'dayjs';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const id = ref<string>(route.params.id as string);
watch(
  () => route.params.id,
  () => {
    id.value = route.params.id as string;
  },
);

const { data, isLoading } = useGetSubmitFormById(id.value);
</script>
<template>
    <ScrollArea class="max-h-[calc(100dvh-150px)]">
        <nav class="flex gap-2 items-center">
            <h2 class="text-xl font-bold">提交记录：</h2>
            <Button @click="router.back()">返回</Button>
        </nav>
        <section v-if="isLoading" class="flex flex-col gap-2">
            <Skeleton class="w-full h-12" />
            <Skeleton class="w-full h-12" />
            <Skeleton class="w-full h-12" />
            <Skeleton class="w-full h-12" />
            <Skeleton class="w-full h-12" />
        </section>
        <section class="flex flex-col gap-2" v-else-if="data?.submit">
            <Card v-for="item in data.submit" @click="router.push(`/workspace/sum/${data.id}/${item.id}`)"
                class=" cursor-pointer">
                <CardHeader>
                    <CardTitle>提交时间：{{ dayjs(item.create_at).format('YYYY年MM月DD日 HH:mm:ss') }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Avatar>
                        <AvatarImage :src="item.profiles.image" alt="提交人姓名" />
                        <AvatarFallback>{{ item.profiles.name.slice(0, 2) }}</AvatarFallback>
                    </Avatar>
                </CardContent>
            </Card>
        </section>
        <section v-else>
            无提交
        </section>
    </ScrollArea>
</template>