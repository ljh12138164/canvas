import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { FaGithub, FaGoogle } from "react-icons/fa6";

const SignIn = () => {
  return (
    <Card>
      <CardHeader>登录</CardHeader>
      <CardDescription>
        请输入您的电子邮件地址和密码以登录到您的帐户。
      </CardDescription>
      <CardContent>
        <section className="space-y-2">
          <Button>
            <FaGithub />
          </Button>
          <Button>
            <FaGoogle />
          </Button>
        </section>
        <p>没有账户 </p>
      </CardContent>
    </Card>
  );
};

export default SignIn;
