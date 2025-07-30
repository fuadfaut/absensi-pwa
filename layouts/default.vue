<template>
  <div class="app-container">
    <!-- Header -->
    <header class="header-bar">
      <div class="flex items-center justify-center">
        <IconLibrary name="clock" size="lg" class="mr-3" />
        <h1 class="text-2xl font-bold">Rekap Absensi</h1>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="scrollable-content p-4">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <footer class="bottom-navigation">
      <NuxtLink to="/" class="nav-button" :class="{ 'active': $route.path === '/' }">
        <IconLibrary name="clipboard-document-list" size="lg" />
        <span>Rekap</span>
      </NuxtLink>

      <NuxtLink to="/riwayat" class="nav-button" :class="{ 'active': $route.path === '/riwayat' }">
        <IconLibrary name="calendar-days" size="lg" />
        <span>Riwayat</span>
      </NuxtLink>

      <NuxtLink to="/settings" class="nav-button" :class="{ 'active': $route.path === '/settings' }">
        <IconLibrary name="cog-6-tooth" size="lg" />
        <span>Pengaturan</span>
      </NuxtLink>
    </footer>

  </div>
</template>

<script setup>
import IconLibrary from '~/components/icons/IconLibrary.vue'
</script>

<style scoped>
/* Additional scoped styles if needed */
</style>
