"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSignIn, useSignUp } from "@/hook/query/useUserQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { z } from "zod";
import Protect from "./Protect";
import { redirect } from "next/navigation";
const schema = z.object({
  // 设置name为可选，且可以为空字符串
  name: z
    .string()
    .min(2, "用户名长度至少为2位")
    .optional()
    .nullable()
    .or(z.literal("")),
  accoute: z.string().min(5, {
    message: "账号长度至少为5位",
  }),
  password: z
    .string()
    .min(6, "密码长度至少为6位")
    .max(16, "密码长度最多为16位"),
});

const SignIn = () => {
  const [login, setLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { signUpMutate, signUpPending } = useSignUp();
  const { signInMutate, signInPending } = useSignIn();
  const { register, handleSubmit, formState, setError } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
  });
  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (login) {
      toast.loading("登录中...");
      signInMutate(
        {
          account: data.accoute,
          password: data.password,
        },
        {
          onSuccess: (data) => {
            toast.dismiss();
            toast.success("登录成功");
            localStorage.setItem("token", data.token);
            redirect("/board");
          },
          onError: (err) => {
            toast.dismiss();
            toast.error(err.message);
          },
        }
      );
    } else {
      if (data.name) {
        toast.loading("注册中...");
        signUpMutate(
          data as {
            accoute: string;
            password: string;
            name: string;
          },
          {
            onSuccess: async (data) => {
              toast.dismiss();
              toast.success("注册成功");
              localStorage.setItem("token", data.token);
              redirect("/board");
            },
            onError: () => {
              toast.dismiss();

              toast.error("注册失败");
            },
          }
        );
      } else {
        setError("name", { message: "用户名不能为空" });
      }
    }
  };
  return (
    <Protect>
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
                disabled={signUpPending || signInPending}
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
    </Protect>
  );
};

export default SignIn;
