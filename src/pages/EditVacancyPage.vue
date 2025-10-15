<template>
  <div class="container">
    <h1 class="mb-3">Edit Vacancy</h1>
    <CreateVacancyForm v-if="job" :job="job" />
    <p v-else>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import CreateVacancyForm from '@/components/ui/CreateVacancyForm.vue'
import type { Job } from '@/interfaces/job.interface'

const route = useRoute()
const job = ref<Job>()

onMounted(async () => {
  const jobId = route.params.id as string
  if (jobId) {
    const docRef = doc(db, 'jobs', jobId)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      job.value = { id: snapshot.id, ...snapshot.data() } as Job
    }
  }
})
</script>
