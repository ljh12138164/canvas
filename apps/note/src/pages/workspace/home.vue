<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FromCard from '@/components/workspace/FromCard.vue';
import InviteDialog from './InviteDialog.vue';
</script>
<template>
  <section class="home-container ">
    <header class="header-container">
      <h2 class="header-title">您还未选择工作区</h2>
      <p class="header-description">创建一个新的工作区开始使用</p>
    </header>
    <div class="button-container">
      <Dialog>
        <DialogTrigger aschildren>
          <Button variant="outline">创建工作区</Button>
        </DialogTrigger>
        <DialogContent>
          <FromCard />
        </DialogContent>
      </Dialog>
      <InviteDialog />
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-container {
  height: calc(100dvh - 100px);
  padding: 10px;
  border-radius: 10px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
}

.header-description {
  font-size: 16px;
  color: #666;
}

.button-container {
  display: flex;
  gap: 10px;
}
</style>
