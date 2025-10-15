<template>
  <div class="container">
    <h1>Current Jobs</h1>
    <div v-if="loading">Loading jobs...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="!filteredJobs || filteredJobs.length === 0">No jobs found.</div>

    <div v-else>
      <JobCard
        v-for="job in paginatedJobs"
        :key="job.id"
        :job="job"
      />
    </div>

    <Pagination
      v-model:currentPage="currentPage"
      :totalPages="totalPages"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useJobsStore } from '@/stores/JobsStore.ts'
import { storeToRefs } from 'pinia'
import JobCard from '@/components/ui/JobCard.vue'
import Pagination from '@/components/ui/Pagination.vue'

const jobsStore = useJobsStore()
const { filteredJobs, loading, error } = storeToRefs(jobsStore)

const currentPage = ref(1)
const itemsPerPage = 10

const paginatedJobs = computed(() => {
  const jobsArray = filteredJobs.value || []
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return jobsArray.slice(start, end)
})

const totalPages = computed(() => {
  const count = filteredJobs.value?.length ?? 0
  const pages = Math.ceil(count / itemsPerPage)
  return pages > 0 ? pages : 1
})


onMounted(() => {
  jobsStore.getJobs()
})
</script>

<style scoped>
.container {
  max-width: 90%;
  margin: 0 auto;
}
</style>
