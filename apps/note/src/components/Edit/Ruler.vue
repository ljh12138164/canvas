<script setup lang="ts">
const markers = Array.from({ length: 83 }, (_, i) => i);
</script>
<template>
  <div class="ruler">
    <div class="ruler-line">
      <div class="inset-x-0 bottom-0 h-full">
        <div class="relative h-full w-[816px]">
          <div
            v-for="marker in markers"
            :key="marker"
            class="ruler-marker"
            :style="{ left: `${(marker * 816) / 82}px` }"
          >
            <div v-if="marker % 10 === 0" class="ruler-marker-text" />
            <div
              v-if="marker % 5 === 0 && marker % 10 !== 0"
              class="ruler-marker-text-small"
            />
            <div v-if="marker % 5 !== 0" class="ruler-marker-text-smallest" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ruler {
  display: flex;
  height: 12px;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  align-items: end;

  &-line {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    max-width: 814px;
    width: 100%;
    height: 100%;
    position: relative;
  }

  &-marker {
    height: 12px;
    bottom: 0;
    position: absolute;

    &-text {
      position: absolute;
      width: 2px;
      height: 6px;
      background-color: #e0e0e0;
      bottom: 0;
      font-size: 10px;
    }
    &-text-small {
      position: absolute;
      width: 2px;
      height: 4px;
      background-color: #e0e0e0;
      bottom: 0;
      font-size: 10px;
    }
    &-text-smallest {
      position: absolute;
      width: 2px;
      height: 2px;
      background-color: #e0e0e0;
      bottom: 0;
      font-size: 10px;
    }
  }
}
</style>
