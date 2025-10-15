<template>
  <div class="config-height bg-secondary-subtle d-flex align-items-center">
    <div class="container d-flex flex-row">
      <v-select
        class="mr-4"
        label="Type of Job"
        :items="typeOfJobSelect"
        v-model="selectedType"
        clearable
      ></v-select>

      <v-select
        label="Location"
        :items="locationSelect"
        v-model="selectedLocation"
        clearable
      ></v-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJobsStore } from '@/stores/JobsStore.ts'
import { storeToRefs } from 'pinia'

const jobsStore = useJobsStore()
const { selectedType, selectedLocation } = storeToRefs(jobsStore)

const typeOfJobSelect: string[] = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance', 'Other']
const locationSelect: string[] = ['Remote', 'Lviv', 'Kyiv', 'Ivano-Frankivsk', 'Dnipro', 'Abroad']
</script>

<style scoped>
.config-height {
  height: 20vh;
}
</style>
