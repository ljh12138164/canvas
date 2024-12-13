// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@hebilicious/vue-query-nuxt',
    'nuxt-lucide-icons',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  vueQuery: {
    // useState key used by nuxt for the vue query state.
    stateKey: 'vue-query-nuxt', // default
    // Pass the vue query client options here ...
    queryClientOptions: {
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000 * 5,
          retry: 3,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          refetchOnMount: true,
          refetchInterval: 60 * 1000 * 5,
          refetchIntervalInBackground: true,
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: 'https://spvppoqewfwqyzlsmtru.supabase.co',
      supabaseKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwdnBwb3Fld2Z3cXl6bHNtdHJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4ODA4MzgsImV4cCI6MjA0OTQ1NjgzOH0.HzXRR0AG0WYAyDjH3Df4pbW7b2nR2tOcRoDr0xd3eF0',
    },
  },
});
