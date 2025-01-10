<script setup lang="ts">
import i18next from "i18next";
import { z } from "zod";
import translation from "./lib/error.json";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { zodI18nMap } from "zod-i18n-map";

i18next.init({
  lng: "zh-CN",
  resources: {
    zh: {
      zod: translation,
    },
  },
});
z.setErrorMap(zodI18nMap);
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
