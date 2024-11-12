<script lang="tsx" setup>
import { hc } from "hono/client";
import type { App } from "api";
import { onMounted } from "vue";

const client = hc<App>("http://localhost:8400");
onMounted(() => {
  const a = client.api.ws.$ws(0);
  a.onmessage = (e) => {
    console.log(e);
  };
  a.onopen = () => {
    console.log("open");
  };
  a.send("hello");
});
</script>
<template>
  <div class="content">
    <h1>Rsbuild with Vue</h1>
    <p>Start building amazing things with Rsbuild.</p>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: center;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.5;
}
</style>
