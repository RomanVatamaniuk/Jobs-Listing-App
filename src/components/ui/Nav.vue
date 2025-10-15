<template>
  <v-app class="configure-height">
    <v-app-bar>
      <v-app-bar-nav-icon
        class="d-sm-none"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <div class="container d-flex flex-row">
        <v-app-bar-title>Job Listing App</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn
          class="d-none d-sm-flex"
          variant="text"
          to="/"
          router
        >
          Jobs
        </v-btn>

        <v-btn
          class="d-none d-sm-flex"
          variant="text"
          to="/create-vacancy"
          router
        >
          Create Vacancy
        </v-btn>

        <v-btn
          class="d-none d-sm-flex"
          variant="text"
          to="/about"
          router
        >
          About
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      temporary
      color="grey-lighten-4"
      class="d-sm-none"
    >
      <v-list>
        <v-list-item
          to="/"
          title="Jobs"
          prepend-icon="mdi-briefcase"
          router
        ></v-list-item>

        <v-list-item
          to="/create-vacancy"
          title="Create Vacancy"
          prepend-icon="mdi-plus-box"
          router
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(false)
</script>

<style scoped>
.configure-height {
  height: 7vh;
}
</style>
