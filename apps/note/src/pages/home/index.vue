<script setup lang="ts">
import ThemeChange from '@/components/common/ThemeChange.vue';
import UserButton from '@/components/common/UserButton.vue';
import { getCurrentUser } from '@/server/supabase/user';
import type { Sessions } from '@/types/user';
import { onBeforeMount, ref } from 'vue';
const loading = ref(true);
const user = ref<Sessions | undefined>(undefined);

const features = ref([
  {
    title: '简单易用',
    description: '直观的界面设计，快速上手，像写笔记一样自然',
    icon: '📝',
  },
  {
    title: '实时协作',
    description: '多人实时编辑，无缝协作，激发团队创造力',
    icon: '👥',
  },
  {
    title: '强大功能',
    description: '支持 Markdown、富文本编辑、多种功能',
    icon: '⚡',
  },
  {
    title: '数据安全',
    description: '安全可靠的数据存储和备份机制',
    icon: '🔒',
  },
]);
onBeforeMount(async () => {
  const users = await getCurrentUser();
  loading.value = false;
  if (users) user.value = users.session as Sessions;
});
</script>

<template>
  <div class="home-container">
    <nav class="nav">
      <div class="nav-left">
        <img src="../../assets/image/logoImage.jpg" alt="Logo" class="logo" />
        <span class="brand">ljh-note</span>
      </div>
      <div class="nav-right">
        <ThemeChange />
        <UserButton :isLoading="loading" :user="user" />
      </div>
    </nav>

    <main>
      <section class="hero">
        <h1>你的笔记记录工具</h1>
        <p class="subtitle">
          简单、强大、安全的笔记应用，助你更好地整理思维和知识
        </p>
        <RouterLink to="/workspace">
          <button class="cta-btn">开始使用</button>
        </RouterLink>
      </section>

      <section class="features">
        <div class="features-grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background-color: var(--background);
  color: var(--foreground);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);

  .nav-left {
    display: flex;
    align-items: center;
    gap: 1rem;

    .logo {
      height: 2rem;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 600;
    }
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}

.hero {
  text-align: center;
  padding: 6rem 2rem;
  max-width: 800px;
  margin: 0 auto;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    background: linear-gradient(to right, #007cf0, #00dfd8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--muted-foreground);
    margin-bottom: 2rem;
  }
}

.features {
  padding: 4rem 2rem;
  background-color: var(--secondary);

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}

.feature-card {
  padding: 2rem;
  background-color: var(--background);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--muted-foreground);
    line-height: 1.6;
  }
}

.primary-btn,
.cta-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background-color: var(--primary);
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}

.cta-btn {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}
</style>
