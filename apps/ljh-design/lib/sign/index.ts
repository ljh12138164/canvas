import { getCurrentUser } from "@/api/supabase/sign";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

type Payload = {
  userid: string;
  expiresAt: Date;
};

export function jwtEncode(payload: Payload) {
  const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET
  );
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}
interface DecodeResult extends JWTPayload {
  userid: string;
  expiresAt: Date;
}
export async function jwtDecode(
  token: string = ""
): Promise<DecodeResult | null> {
  const JWT_SECRET = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET
  );
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as DecodeResult;
  } catch {
    console.error("解码失败");
    return null;
  }
}

export async function getUser(userId: string) {
  const user = await getCurrentUser({ userId });
  return user;
}
