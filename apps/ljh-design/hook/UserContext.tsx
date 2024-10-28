import { User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrentUser } from "@/lib/api/sign";
import { redirect } from "next/navigation";

const UserContexts = createContext<User | null>(null);
export const UserContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    async function getUser() {
      const user = await getCurrentUser();
      // setUser(user);
      if (user && window.location.pathname === "/sign-in") {
        redirect("/");
      }
    }
    getUser();
  }, [user]);
  return <UserContexts.Provider value={user}>{children}</UserContexts.Provider>;
};

export const useUser = () => {
  return useContext(UserContexts);
};
