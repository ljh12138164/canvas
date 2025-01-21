<template>
  <VueDraggable class="drag-area" tag="ul" v-model="list" group="g1">
    <li v-for="el in modelValue" :key="el.name">
      <p>{{ el.name }}</p>
      <form-sub v-model="el.children" />
    </li>
  </VueDraggable>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

export interface IList {
  name: string;
  children: IList[];
}

interface Props {
  modelValue: IList[];
}

const props = defineProps<Props>();

type Emits = (e: 'update:modelValue', value: IList[]) => void;
// console.log(props.modelValue);

const emits = defineEmits<Emits>();
const list = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
});
</script>
<style scoped>
.drag-area {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
