<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
    <div class="h-[100dvh] w-full flex flex-col items-center justify-center">
        <div class="text-9xl font-bold text-gray-200">404</div>
        <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900">页面未找到</h1>
        <p class="mt-4 text-base text-gray-500">抱歉,我们找不到您要访问的页面。</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
            <button @click="goHome"
                class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                返回首页
            </button>
            <button @click="goBack" class="text-sm font-semibold text-gray-900 hover:text-gray-500">
                返回上一页
            </button>
        </div>
    </div>
</template>
