import { NextResponse, NextRequest } from "next/server";
import { jwtDecode } from "./lib/sign";
const protectedRoutes = ["/board"];
const publicRoutes = ["/board/sign-in"];
export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  //获取cookie
  const cookie = req.cookies.get("token")?.value;
  //解密
  const payload = await jwtDecode(cookie);
  if (protectedRoutes.includes(path) && !payload) {
    return NextResponse.redirect("/board/sign-in");
  }
  if (publicRoutes.includes(path) && payload) {
    return NextResponse.redirect(new URL("/board", req.url));
  }
  return NextResponse.next();
}
