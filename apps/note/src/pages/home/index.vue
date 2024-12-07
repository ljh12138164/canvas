<script setup lang="ts">
import ThemeChange from "@/components/common/ThemeChange.vue";
import UserButton from "@/components/common/UserButton.vue";
import { getCurrentUser } from "@/server/supabase/user";
import useUser from "@/store/user";
import { Sessions } from "@/types/user";
import { onBeforeMount } from "vue";
onBeforeMount(async () => {
  const userStore = await getCurrentUser();
  if (userStore) {
    useUser().setUserData({
      session: userStore.session as unknown as Sessions,
    });
    useUser().setIsLoading(false);
  }
});
</script>
<template>
  <section class="main-container">
    <nav class="nav-container bg-[#f0f0f0] dark:bg-[#121212]">
      <ThemeChange />
      <UserButton
        :user="useUser().userData?.session.user"
        :isLoading="useUser().initLoading"
      />
    </nav>
    <main class="main-content">
      <RouterView />
    </main>
  </section>
</template>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100dvh;
  width: 100dvw;
}
.nav-container {
  display: flex;
  padding: 0 10px;
  gap: 10px;
  /* flex-direction: column; */
  align-items: center;
  justify-content: space-between;
  flex-basis: 50px;
  border-bottom: 1px solid #e0e0e0;
  /* background-color: #f0f0f0; */
}
.main-content {
  flex: 1;
  display: flex;
}
</style>
