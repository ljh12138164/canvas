import { User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const UserContexts = createContext<User | null>(null);
export const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const user = localStorage.getItem("ljh-design-user");
    if (user) {
      const decoded = jwt.verify(
        JSON.parse(user),
        process.env.NEXT_PUBLIC_JWT_SECRET!
      );
      if (decoded) {
        setUser(decoded as User);
      }
    } else {
      // redirect("/sign-in");
    }
  }, []);
  return <UserContexts.Provider value={user}>{children}</UserContexts.Provider>;
};

export const useUser = () => {
  return useContext(UserContexts);
};
