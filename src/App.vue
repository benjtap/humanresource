<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(() => {
  // Tente de passer en plein écran dès la première interaction (clic) de l'utilisateur
  // Les navigateurs bloquent le plein écran automatique sans interaction pour sécurité.
  const goFullScreen = () => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Plein écran bloqué par le navigateur :", err.message);
      });
    }
  };

  window.addEventListener('click', goFullScreen, { once: true });
})
</script>

<template>
  <RouterView />
</template>

<style>
/* Global resets */
body {
  margin: 0;
  padding: 0;
}
</style>
