import { getLocalToken, jwtDecode } from "@/lib/sign";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
const init = {
  token: "",
  loading: true,
};
const ProtectContext = createContext(init);
export default function Protect({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      const token = await getLocalToken();
      const userId = await jwtDecode(token);
      if (token && userId) {
        setLoading(false);
        setToken(token);
        redirect("/board");
      }
    })();
  }, [loading, token]);
  return (
    <ProtectContext.Provider value={{ token, loading }}>
      {children}
    </ProtectContext.Provider>
  );
}
export const useProtect = () => {
  return useContext(ProtectContext);
};
