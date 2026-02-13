<template>
  <div class="app">
    <AppHeader />
    <router-view />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>
