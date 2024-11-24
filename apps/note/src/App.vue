<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/home">Go to Home</RouterLink>
    <RouterLink to="/edit">Go to Edit</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
