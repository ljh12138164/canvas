<script setup lang="ts">
import useBearStore from '~/stores';
import { toast } from '~/lib';
const bears = useBearStore();
</script>

<template>
  <UiButton variant="outline" @click="toast.success('Hello')">Button</UiButton>
</template>
