<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LOGO_IMAGE_URL } from '@/lib';
import { toast } from '@/lib';
import { login, signup } from '@/server/supabase/user';
import { Icon } from '@iconify/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { ErrorMessage, Field, Form, useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import * as zod from 'zod';

// 页面加载
const router = useRouter();
const loginType = ref<'login' | 'register'>('login');
const loading = ref(false);
const showPassword = ref(false);

// 表单验证
const zodSchema = zod.object({
  email: zod
    .string({ required_error: '请输入邮箱' })
    .min(1, { message: '请输入邮箱' })
    .email({ message: '请输入正确的邮箱' }),
  password: zod
    .string({ required_error: '请输入密码' })
    .min(6, { message: '请输入密码' })
    .max(16, { message: '密码长度最多为16位' }),
  name: zod.string().min(1, { message: '请输入昵称' }).optional(),
});
const validationSchema = toTypedSchema(zodSchema);
const { setFieldError, errors } = useForm({
  validationSchema,
}); // 使用 useForm 来获取 setFieldError
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

async function onSubmit(values: any) {
  if (!token.value) {
    toast.error('请完成验证');
    return;
  }
  try {
    if (loginType.value === 'register') {
      // 注册
      if (!values.name) {
        return setFieldError('name', '请输入昵称');
      }
      loading.value = true;
      // 注册
      await signup({
        username: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success('请前往邮箱验证');
    } else {
      // 登录
      loading.value = true;
      // console.log(values);
      toast.loading('登录中...');
      // 登录
      await login({
        email: values.email,
        password: values.password,
      });
      toast.success('登录成功');
      router.push('/workspace/home');
    }
  } catch (error) {
    toast.error('登录失败');
  } finally {
    setTimeout(() => {
      toast.dismiss();
    }, 1000);
    loading.value = false;
  }
}
</script>
<template>
  <main class="mainContainer">
    <Card variant="outlined" class="loginCard">
      <section class="loginCardLeft">
        <div class="loginCardLeftTitle">
          <CardHeader class="cardHeader">
            <img :src="LOGO_IMAGE_URL" alt="Logo" class="logo" />
          </CardHeader>
          <div class="loginCardLeftTitleContent">
            <h1 class="loginCardLeftTitleText">欢迎使用</h1>
            <p class="loginCardLeftTitleSubtitle">登录或注册来开始使用</p>
          </div>
        </div>
      </section>
      <CardContent class="loginCardRight">
        <h1 class="cardTitle dark:text-black">欢迎回来</h1>
        <p class="cardSubtitle dark:text-black">请输入您的账号密码</p>
        <main class="cardMain">
          <p class="cardChange">
            <v-btn @click="loginType = 'login'" class="cardChangeButton dark:text-black dark:bg-white"
              :class="loginType === 'login' ? 'active' : ''" variant="text">登录</v-btn>
            <v-btn @click="loginType = 'register'" class="cardChangeButton dark:text-black dark:bg-white"
              :class="loginType === 'register' ? 'active' : ''" variant="text">注册</v-btn>
          </p>
          <Form :validation-schema="validationSchema" @submit="onSubmit" class="form">
            <div class="formItem" v-show="loginType === 'register'">
              <Field placeholder="请输入昵称..." name="name" type="name" class="formInput" />
              <span v-if="errors.name" class="error">
                {{ errors.name }}
              </span>
              <ErrorMessage class="error" name="name" />
            </div>
            <div class="formItem">
              <Field placeholder="请输入邮箱..." name="email" type="email" class="formInput dark:text-black" />
              <ErrorMessage class="error" name="email" />
            </div>
            <div class="formItem">
              <Icon @click="showPassword = !showPassword" :icon="!showPassword
                ? 'weui:eyes-off-outlined'
                : 'weui:eyes-on-outlined'
                " class="formEye" />
              <Field placeholder="请输入密码..." name="password" :type="showPassword ? 'text' : 'password'"
                class="formInput dark:text-black" />
              <ErrorMessage class="error" name="password" />
            </div>
            <div id="turnstile-container" />
            <Button type="submit" :disabled="loading" variant="outline"
              class="formSubmit dark:bg-black dark:text-white">{{
                loginType === 'login'
                  ? loading
                    ? '登录中...'
                    : '登录'
                  : loading
                    ? '注册中...'
                    : '注册'
              }}</Button>
          </Form>
        </main>
      </CardContent>
    </Card>
  </main>
</template>

<style scoped lang="scss">
.mainContainer {
  width: 100%;
  height: 100dvh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  // background-image: linear-gradient(to top, #dcfdf2, #fff);
}

.loginCard {
  min-width: 800px;
  height: 550px;
  border: 1.5px solid rgba(#0000001a, 0.02);
  /* box-shadow: 0 0 100px rgba(#1f34f1, 0.2); */
  background-color: #f6f6f9;
  border-radius: 20px;
  display: flex;
  border-radius: 20px;
  /* flex-direction: column; */
  display: flex;

  &Left {
    flex-basis: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(to bottom,
        rgb(65, 177, 149),
        rgba(65, 177, 149, 0.644));

    &Title {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
      color: white;

      &Content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      &Subtitle {
        font-size: 1rem;
        font-weight: 400;
        text-align: center;
        // color: white;
      }
    }
  }

  &Right {
    flex: 1;
  }
}

.card {
  &Change {
    display: flex;
    justify-content: center;
    gap: 1rem;

    &Button {
      cursor: pointer;
      border-radius: 0px;
      transition: all 0.3s ease;
    }
  }

  &Header {
    height: 40%;
    flex-basis: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &Main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }

  &Title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
  }

  &Subtitle {
    font-size: 1rem;
    text-align: center;
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  height: 100%;
  gap: 2rem;

  &Item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;
    position: relative;
  }

  &Input {
    width: 100%;
    height: 3rem;
    border-radius: 10px;
    border: 2px solid #ccc;
    padding: 0 1rem;

    &:active,
    &:focus {
      border: 2px solid rgb(65, 177, 149);
      outline: none;
      transition: all 0.3s ease;
    }
  }

  &Submit {
    width: 100%;
    border-radius: 5px;
    background-color: rgb(65, 177, 149);
    color: #fff;
    border: none;
  }

  &Error {
    color: rgba(255, 0, 0, 0.56);
  }
}

.active {
  color: rgb(65, 177, 149);
  border-bottom: 2px solid rgb(65, 177, 149);
}

.error {
  color: rgba(255, 0, 0, 0.56);
}

.formEye {
  position: absolute;
  right: 1rem;
  top: 0.7rem;
  cursor: pointer;
  height: 1.5rem;
  width: 1.5rem;
}

.logo {
  width: 100px;
  height: 100px;
}

.loginCardRight {
  margin-top: 40px;
}
</style>
