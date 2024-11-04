import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "./lib/sign";
//受保护的路由
const protectedRoutes = ["/board"];
//登录后跳转
const publicRoutes = ["/board/sign-in"];
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  //获取cookie
  const cookie = req.cookies.get("token")?.value;
  //解密
  const payload = await jwtDecode(cookie);
  if (protectedRoutes.includes(path) && !payload) {
    //没有登录
    return NextResponse.redirect(new URL("/board/sign-in", req.url));
  }
  if (publicRoutes.includes(path) && payload) {
    return NextResponse.redirect(new URL("/board", req.url));
  }
  return NextResponse.next();
}
