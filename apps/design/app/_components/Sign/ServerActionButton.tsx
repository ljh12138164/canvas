"use client";

import { signOut } from "next-auth/react";

const ServerActionButton = () => {
  return <button onClick={() => signOut()}>退出登录</button>;
};

export default ServerActionButton;
