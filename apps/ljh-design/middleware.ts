import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "./lib/sign";

//受保护的路由,包括动态路由/board/Edit/[id]
export const config = {
  matcher: ["/board/Edit/:path*", "/board"],
};

export default async function middleware(req: NextRequest) {
  //获取cookie
  const cookie = req.cookies.get("token")?.value;
  //解密
  const payload = await jwtDecode(cookie);
  if (!payload) {
    return NextResponse.redirect(new URL("/board/sign-in", req.url));
  }
  return NextResponse.next();
}
