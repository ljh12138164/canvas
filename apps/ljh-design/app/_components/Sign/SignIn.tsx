"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSignUp } from "@/lib/react-query/useSignUp";
import { jwtEncode } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { hashSync } from "bcryptjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { z } from "zod";
const schema = z.object({
  accoute: z.string().min(5, {
    message: "账号长度至少为5位",
  }),
  password: z.string().min(6, { message: "密码长度至少为6位" }).max(16, {
    message: "密码长度最多为16位",
  }),
  name: z.string().min(2, { message: "用户名长度至少为2位" }).optional(),
});

const SignIn = () => {
  const [login, setLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { signUpMutate, signUpPending } = useSignUp();
  useEffect(() => {}, []);
  const { register, handleSubmit, formState } = useForm<z.infer<typeof schema>>(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        name: "",
        accoute: "",
        password: "",
      },
    }
  );
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (login) {
      console.log(login);
    } else {
      data.password = hashSync(data.password, 10);
      if (data.name)
        signUpMutate(
          data as {
            accoute: string;
            password: string;
            name: string;
          },
          {
            onSuccess: async (user) => {
              toast.success("注册成功");

              // 创建 JWT
              const token = await jwtEncode({
                //@ts-ignore
                id: user?.id as string,
                //@ts-ignore
                name: user?.name as string,
                //@ts-ignore
                account: user?.account as string,
              });

              // 将 token 存储在本地存储中
              localStorage.setItem("token", token);
            },
            onError: (err) => {
              console.error(err);
              toast.error("注册失败");
            },
          }
        );
    }
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
                {...register("accoute")}
                placeholder="账户"
                className={`${formState.errors.accoute && "border-red-500"}`}
              />
              {formState.errors?.accoute && (
                <span className="text-red-500 text-sm">
                  {formState.errors?.accoute.message}
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
              {login
                ? `登录${signUpPending ? "中..." : ""}`
                : `注册${signUpPending ? "中..." : ""}`}
            </Button>
          </form>
          <Separator className="mt-6" />

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
