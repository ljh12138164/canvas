<template>
 <main class="main-container">
     <nav class="nav-container">
         <Button variant="ghost" class="p-0 w-24" @click="router.back()">
      <ArrowLeft />
      <span>返回</span>
    </Button>
</nav>
<section class="card-container">
    <div v-if="workspaceIsFetching">
        <Skeleton class="w-full h-[50px] bg-[#d8d8d8] dark:bg-[#3a3a3a]" />
    </div>
    <div v-else-if="activeFolder">
        <Card>
            <CardHeader>
                <CardTitle>{{ activeFolder.title }}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{{ activeFolder.title }}</p>
                
            </CardContent>
        </Card>
    </div>
    <div v-else>
        <h1>没有文件夹</h1>
    </div>
</section>
</main>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton/Skeleton.vue';
import { useGetWorkspaceById } from '@/hooks/workspace';
import { ArrowLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const { workspaceIsFetching, workspace } = useGetWorkspaceById(route.params.workspaceId as string);

const activeFolder = computed(() => {
  if (!workspace.value) return null;
  const folder = workspace.value.folders.find((folder) => folder.id === route.params.folderId);
  if (!folder) return null;
  return folder;
});
</script>
<style scoped lang="scss">
.card-container {
  padding: 10px;
}
.nav-container {
  padding: 10px;
  height: 80px;
}
.main-container {
  padding: 10px;
  height: calc(100dvh - 80px);
}
</style>

