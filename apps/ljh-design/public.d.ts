declare global {
  namespace NodeJS {
    interface Dict {
      NEXT_PUBLIC_JWT_SECRET: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

