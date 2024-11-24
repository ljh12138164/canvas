<script setup lang="ts">
import { toast } from "@/libs";
import { login, signup } from "@/server/supabase/user";
import { Icon } from "@iconify/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, Field, Form, useForm } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";

import * as zod from "zod";

// 页面加载
const router = useRouter();
const loginType = ref<"login" | "register">("login");
const loading = ref(false);
const showPassword = ref(false);

// 表单验证
const zodSchema = zod.object({
  email: zod
    .string({ required_error: "请输入邮箱" })
    .min(1, { message: "请输入邮箱" })
    .email({ message: "请输入正确的邮箱" }),
  password: zod
    .string({ required_error: "请输入密码" })
    .min(6, { message: "请输入密码" })
    .max(16, { message: "密码长度最多为16位" }),
  name: zod.string().min(1, { message: "请输入昵称" }).optional(),
});
const validationSchema = toTypedSchema(zodSchema);
const { setFieldError, errors } = useForm({
  validationSchema,
}); // 使用 useForm 来获取 setFieldError

async function onSubmit(values: any) {
  try {
    if (loginType.value === "register") {
      // 注册
      if (!values.name) {
        return setFieldError("name", "请输入昵称");
      }
      loading.value = true;
      // 注册
      await signup({
        username: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("请前往邮箱验证");
    } else {
      // 登录
      loading.value = true;
      console.log(values);
      toast.loading("登录中...");
      toast.dismiss();
      // 登录
      await login({
        email: values.email,
        password: values.password,
      });
      toast.success("登录成功");
      router.push("/");
    }
  } catch (error) {
    toast.dismiss();
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("登录失败");
    }
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <main class="mainContainer">
    <v-card variant="outlined" class="loginCard">
      <section class="cardContent">
        <header class="cardHeader">
          <!-- TODO:logo -->
          <div style="width: 100px; height: 100px; background: #eee"></div>
          <h1 class="cardTitle">欢迎回来</h1>
          <p class="cardSubtitle">请输入您的账号密码</p>
        </header>
        <main class="cardMain">
          <p class="cardChange">
            <v-btn
              @click="loginType = 'login'"
              class="cardChangeButton"
              :class="loginType === 'login' ? 'active' : ''"
              variant="text"
              >登录</v-btn
            >
            <v-btn
              @click="loginType = 'register'"
              class="cardChangeButton"
              :class="loginType === 'register' ? 'active' : ''"
              variant="text"
              >注册</v-btn
            >
          </p>
          <Form
            :validation-schema="validationSchema"
            @submit="onSubmit"
            class="form"
          >
            <div class="formItem" v-show="loginType === 'register'">
              <Field
                placeholder="请输入昵称..."
                name="name"
                type="name"
                class="formInput"
              />
              <span v-if="errors.name" class="error"> {{ errors.name }} </span>
              <ErrorMessage class="error" name="name" />
            </div>
            <div class="formItem">
              <Field
                placeholder="请输入邮箱..."
                name="email"
                type="email"
                class="formInput"
              />
              <ErrorMessage class="error" name="email" />
            </div>
            <div class="formItem">
              <Icon
                @click="showPassword = !showPassword"
                :icon="
                  !showPassword
                    ? 'weui:eyes-off-outlined'
                    : 'weui:eyes-on-outlined'
                "
                class="formEye"
              />

              <Field
                placeholder="请输入密码..."
                name="password"
                :type="showPassword ? 'text' : 'password'"
                class="formInput"
              />
              <ErrorMessage class="error" name="password" />
            </div>
            <v-btn
              type="submit"
              :disabled="loading"
              variant="outlined"
              class="formSubmit"
              >{{
                loginType === "login"
                  ? loading
                    ? "登录中..."
                    : "登录"
                  : loading
                    ? "注册中..."
                    : "注册"
              }}</v-btn
            >
          </Form>
        </main>
      </section>
    </v-card>
  </main>
</template>

<style scoped lang="scss">
.mainContainer {
  min-width: 450px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to top, #dcdffd, #fff);
}
.loginCard {
  min-width: 450px;
  height: 550px;
  border: 1.5px solid rgba(#0000001a, 0.02);
  box-shadow: 0 0 100px rgba(#1f34f1, 0.2);
  background-color: #f6f6f9;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
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

  &Content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
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
  transition: all 0.3s ease;
  align-items: center;
  padding: 2rem;
  width: 100%;
  height: 100%;
  gap: 1rem;
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
      border: 2px solid #1f34f1;
      outline: none;
      transition: all 0.3s ease;
    }
  }
  &Submit {
    width: 100%;
    border-radius: 5px;
    background-color: #1f34f1;
    color: #fff;
    border: none;
  }
  &Error {
    color: rgba(255, 0, 0, 0.56);
  }
}
.active {
  color: #1f34f1;
  border-bottom: 2px solid #1f34f1;
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
</style>
