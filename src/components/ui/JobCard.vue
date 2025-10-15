<template>
  <v-card
    class="job-card"
    @click="goToJobPage"
    hover
  >
    <v-card-title>{{ job.title }}</v-card-title>
    <v-card-subtitle>{{ job.company }}</v-card-subtitle>

    <v-card-text>
      <p>{{ job.description }}</p>
      <p><strong>Type:</strong> {{ job.type }}</p>
      <p><strong>Location:</strong> {{ job.location }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn
        :color="'blue'"
        :href="job.applyLink"
        target="_blank"
        rel="noopener"
        @click.stop
      >
        Apply Now
      </v-btn>

      <v-btn
        @click.stop="goToJobPage"
        target="_blank"
        rel="noopener"
      >
        See Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Job } from '@/interfaces/job.interface.ts'
import type { HistoryState } from 'vue-router'

const props = defineProps<{ job: Job }>()
const router = useRouter()

const goToJobPage = () => {
  router.push({
    path: `/${props.job.id}`,
    state: props.job as unknown as HistoryState
  })
}
</script>

<style scoped>
.job-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}
.job-card:hover {
  transform: translateY(-3px);
}
</style>
