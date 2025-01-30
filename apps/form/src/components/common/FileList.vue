<script setup lang="ts">
import { downLoad } from '@/lib';
import type { FileType } from '@/types/form';
import { Download as DownLoad } from 'lucide-vue-next';
import { Badge } from '../ui/badge';
import Button from '../ui/button/Button.vue';

defineProps<{ sumbit: FileType }>();

// 根据文件类型返回对应的图标
const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();

  if (type.includes('image')) return '🖼️';
  if (type.includes('pdf')) return '📄';
  if (type.includes('word') || type.includes('doc')) return '📝';
  if (type.includes('excel') || type.includes('sheet')) return '📊';
  if (type.includes('video')) return '🎥';
  if (type.includes('audio')) return '🎵';
  return '📁'; // 默认文件图标
};
</script>

<template>
    <div>
        <div v-if="sumbit.hiddenLabel"> {{ getFileIcon(sumbit.fullType!) }}</div>
        <div class="flex flex-col  gap-2">
            <!-- <Badge class="mr-3">{{ sumbit.fileType }}</Badge> -->
            <section class="flex gap-2">
                <Badge class="max-w-24">{{ sumbit.fullType }}</Badge>
                <Button @click="() => downLoad(sumbit.file!, sumbit.fileType!)">
                    下载
                    <DownLoad />
                </Button>
            </section>
            <div v-if="sumbit.fullType?.startsWith('image')">
                <viewer :images="sumbit.file" class="h-20 w-20">
                    <img v-for="src in [sumbit.file]" alt="表单图片" :key="src" :src="src">
                </viewer>
            </div>

        </div>
    </div>
</template>
