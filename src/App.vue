<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
  </v-snackbar>
  <Nav/>
  <router-view></router-view>
</template>

<script setup lang="ts">
import Nav from '@/components/ui/Nav.vue'
import { useSnackbarStore } from '@/stores/SnackbarStore.ts'

const snackbar = useSnackbarStore()
</script>

<style scoped>

</style>
