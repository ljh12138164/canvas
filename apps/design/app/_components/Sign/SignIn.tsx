"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
type LoginProvider = "github" | "google";
const SignIn = () => {
  const [login, setLogin] = useState(true);
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
      <CardDescription>
        {login
          ? "请输入您的电子邮件地址和密码以登录到您的帐户。"
          : "请输入您的电子邮件地址和密码以注册到您的帐户。"}
      </CardDescription>
      <CardContent className=" space-y-5 px-0 pb-0">
        <section className="space-y-2.5 mt-6 flex flex-col gap-y-2.5">
          <Button
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full flex px-6 items-center justify-center gap-x-2"
          >
            <FaGithub className="size-4" />
            <span>使用 Github {login ? "登录" : "注册"}</span>
          </Button>
          <Button
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full flex px-6 items-center justify-center gap-x-2"
          >
            <FcGoogle className="size-4 " />
            <span>使用 Google {login ? "登录" : "注册"}</span>
          </Button>
        </section>
        {/* <p className="text-xs text-muted-foreground">
          {login ? (
            <p>
              没有账户
              <span
                onClick={() => setLogin(false)}
                className="text-sky-700 hover:underline transform cursor-pointer"
              >
                注册
              </span>
            </p>
          ) : (
            <p onClick={() => setLogin(true)}>
              已有账户
              <span
                onClick={() => setLogin(false)}
                className="text-sky-700 hover:underline cursor-pointer"
              >
                登录
              </span>
            </p>
          )}
        </p> */}
      </CardContent>
    </Card>
  );
};

export default SignIn;
