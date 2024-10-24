"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { useSignUp } from "@/lib/react-query/useSignUp";
import { z } from "zod";
import toast from "react-hot-toast";
import { hashPassword } from "@/lib/utils";
import { hashSync } from "bcryptjs";
const schema = z.object({
  email: z.string().email({ message: "请输入正确的电子邮件地址" }),
  password: z.string().min(3, { message: "密码长度至少为3位" }).max(20, {
    message: "密码长度最多为20位",
  }),
  name: z.string().min(2, { message: "用户名长度至少为2位" }).optional(),
});

type LoginProvider = "github" | "google";
const SignIn = () => {
  const { signUpMutate, signUpPending, signUpSuccess, signUpError } =
    useSignUp();
  const [login, setLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState, setError } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!login && !data.name) setError("name", { message: "未填用户" });
    if (login)
      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirectTo: "/",
      });
    else {
      if (data.name) {
        data.password = hashSync(data.password, 10);
        signUpMutate(
          { ...data, name: data.name },
          {
            onSuccess: () => {
              toast.success("注册成功");
            },
          }
        );
      } else setError("name", { message: "未填用户名" });
    }
  };
  const onProviderSignIn = (provider: LoginProvider) => {
    signIn(provider, { redirectTo: "/" });
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">
          {login ? "登录" : "注册"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <section className="space-y-2.5 mt-6 flex flex-col gap-y-2.5">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <div className={`${login ? "hidden" : "block"}`}>
              <Input
                {...register("name")}
                placeholder="用户名"
                className={`${formState.errors.name && "border-red-500"}`}
              />
              {formState.errors.name && (
                <span className="text-red-500 text-sm">
                  {formState.errors.name.message}
                </span>
              )}
            </div>
            <div>
              <Input
                {...register("email")}
                placeholder="电子邮件"
                className={`${formState.errors.email && "border-red-500"}`}
              />
              {formState.errors.email && (
                <span className="text-red-500 text-sm">
                  {formState.errors.email.message}
                </span>
              )}
            </div>
            <div className=" relative">
              {showPassword ? (
                <BsEye
                  onClick={() => setShowPassword((show) => !show)}
                  size={18}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2  rounded-md hover:text-blue-500 transition-colors duration-300  "
                />
              ) : (
                <BsEyeSlash
                  onClick={() => setShowPassword((show) => !show)}
                  size={18}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2  hover:text-blue-500    transition-colors duration-300  "
                />
              )}

              <Input
                {...register("password")}
                placeholder="密码"
                className={`${formState.errors.password && "border-red-500"}`}
                type={showPassword ? "text" : "password"}
                maxLength={20}
              />
              {formState.errors.password && (
                <span className="text-red-500 text-sm">
                  {formState.errors.password.message}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-2.5"
              disabled={signUpPending}
            >
              {login ? "登录" : "注册"}
            </Button>
          </form>
          <Separator className="mt-6" />
          <Button
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full flex px-6 items-center justify-center gap-x-2"
          >
            <FaGithub className="size-4" />
            <span>使用 Github 登录</span>
          </Button>
          <Button
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full flex px-6 items-center justify-center gap-x-2"
          >
            <FcGoogle className="size-4 " />
            <span>使用 Google 登录 </span>
          </Button>
          <p
            className=" cursor-pointer text-blue-500 text-sm text-center"
            onClick={() => setLogin(!login)}
          >
            {login ? "没有账号？点击注册" : "已有账号？点击登录"}
          </p>
        </section>
      </CardContent>
    </Card>
  );
};

export default SignIn;
