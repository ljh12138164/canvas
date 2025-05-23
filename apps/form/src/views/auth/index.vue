<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toast';
import { login, signup } from '@/database/supabase/user';
import { toast } from '@/lib';
import { cn } from '@/lib/utils';
import { to } from 'await-to-js';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const isLoading = ref(false);
const isLogin = ref(true);
const email = ref('');
const password = ref('');
const name = ref('');
const router = useRouter();
const token = ref('');

onMounted(() => {
  // @ts-ignore
  turnstile.render('#turnstile-container', {
    // sitekey: "0x4AAAAAAA8NncDcOl1Duk3E",
    sitekey: '0x4AAAAAAA8NncDcOl1Duk3E',
    // 設置回調
    callback: (turnstileToken: string) => {
      token.value = turnstileToken;
    },
    language: 'zh-cn', // 设置语言,
    'expired-callback': () => {
      token.value = '';
    },
  });
});

async function onSubmit() {
  isLoading.value = true;

  // if (!token.value) {
  //   toast.error('请完成验证');
  //   isLoading.value = false;
  //   return;
  // }

  if (isLogin.value) {
    if (!email.value?.includes('@')) {
      toast.error('邮箱格式不正确');
      isLoading.value = false;
      return;
    }
    toast.info('登录中...');
    const [error] = await to(
      login({
        email: email.value,
        password: password.value,
      }),
    );
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('登录成功');
      router.push('/workspace/board');
    }
  } else {
    //校验
    if (email.value?.length < 3 || password.value?.length < 3 || password.value?.length > 12) {
      toast.error('请输入邮箱和密码');
      isLoading.value = false;
      return;
    }
    if (!email.value?.includes('@')) {
      toast.error('邮箱格式不正确');
      isLoading.value = false;
      return;
    }
    toast.info('注册中...');
    const [error] = await to(
      signup({
        username: name.value,
        email: email.value,
        password: password.value,
      }),
    );
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('请前往邮箱接受验证');
    }
  }
  isLoading.value = false;
}
</script>

<template>
  <Toaster />
  <main class="w-full h-[100dvh] grid grid-cols-1 md:grid-cols-2 justify-center items-center entryf">
    <div class="relative h-full hidden flex-col bg-muted p-10 text-white dark:border-r md:block">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-[2rem] font-medium">
        🚥自定义表单
      </div>
    </div>
    <div>
      <Button @click="isLogin = !isLogin" class="absolute top-12 right-12">
        {{ isLogin ? "注册" : "登录" }}
      </Button>
      <div class="mx-auto flex w-full max-w-[350px] relative flex-col justify-center space-y-6">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            {{ isLogin ? "登录" : "注册" }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ isLogin ? "请输入邮箱" : "请输入邮箱" }}
          </p>
        </div>
        <div :class="cn('grid gap-6', $attrs.class ?? '')">
          <form @submit.prevent="onSubmit">
            <div class="grid gap-4">
              <div v-if="!isLogin">
                <Label class="sr-only" for="name"> 姓名 </Label>
                <Input v-model="name" id="name" placeholder="请输入姓名" type="text" auto-capitalize="none"
                  auto-complete="name" auto-correct="off" minlength="3" maxlength="10"
                  class="dark:placeholder:text-black" :disabled="isLoading" />
              </div>
              <div class="grid gap-1">
                <Label class="sr-only" for="email"> 邮箱 </Label>
                <Input v-model="email" id="email" placeholder="code@qq.com" type="email" auto-capitalize="none"
                  auto-complete="email" auto-correct="off" :disabled="isLoading" />
              </div>
              <div class="grid gap-1">
                <Label class="sr-only" for="password"> 密码 </Label>
                <Input v-model="password" id="password" placeholder="请输入密码" class="dark:placeholder:text-black"
                  type="password" auto-capitalize="none" auto-complete="password" auto-correct="off"
                  :disabled="isLoading" minlength="3" maxlength="10" />
              </div>
              <div id="turnstile-container" />
              <Button type="submit" :disabled="isLoading">
                {{ isLogin ? "登录" : "注册" }}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
