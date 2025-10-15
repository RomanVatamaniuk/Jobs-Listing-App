<template>
  <div class="d-flex flex-column justify-content-center mt-10 fix-selection-bug">
    <div class="text-center">
      <h1>About The App</h1>
      <p>This project was made by Roman Vatamaniuk as a test task for <strong>Devima Solutions</strong> company</p>
      <p><strong>Technologies used:</strong> Vue 3, Pinia, Vite, TypeScript, HTML, CSS, Bootstrap, Vuetify, Firebase, Firestore</p>
      <v-btn
        to="/"
        router
        variant="outlined"
        class="configure-width"
      >
        Back to Jobs List
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.configure-width {
  width: 20vw;
}
.fix-selection-bug {
  user-select: text !important;
  pointer-events: auto !important;
  -webkit-user-select: text !important;
  backface-visibility: visible !important;
  -webkit-backface-visibility: visible !important;
  transform: none !important;
  position: relative;
  z-index: 1;
}
</style>
