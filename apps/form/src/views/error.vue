<template>
    <div>
        <h1>错误</h1>
        <div class="h-[100dvh] w-full flex flex-col items-center justify-center">
            <div class="text-9xl font-bold text-gray-200">Error</div>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900">系统错误</h1>
            <p class="mt-4 text-base text-gray-500">抱歉,系统发生了一些错误。</p>
            <div class="mt-10">
                <button @click="goBack"
                    class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    返回上一页
                </button>
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
