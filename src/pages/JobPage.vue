<template>
  <div class="container" v-if="job">
    <v-btn
      to="/"
      router
      variant="outlined"
      class="flex-grow-1 mb-2"
    >
      Back to Jobs List
    </v-btn>

    <h1>{{ job.title }}</h1>
    <h2>{{ job.company }}</h2>
    <p>{{ job.description }}</p>
    <p><strong>Type:</strong> {{ job.type }}</p>
    <p><strong>Location:</strong> {{ job.location }}</p>

    <v-btn
      :href="job.applyLink"
      target="_blank"
      rel="noopener"
      color="primary"
    >
      Apply Now
    </v-btn>

    <v-btn
      color="error"
      variant="outlined"
      class="flex-grow-1 ml-2 mr-2"
      @click="dialog = true"
    >
      Delete
    </v-btn>

    <v-btn
      :to="`/edit-vacancy/${job.id}`"
      router
      color="primary"
      variant="outlined"
      class="flex-grow-1 ml-2 mr-2"
    >
      Edit
    </v-btn>

    <ConfirmDialog
      v-model="dialog"
      message="Are you sure you want to delete this page?"
      @confirm="confirmDelete"
    />
  </div>

  <div v-else-if="loading">Loading job...</div>
  <div v-else>Error: job not found.</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase.ts'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useSnackbarStore } from '@/stores/SnackbarStore.ts'
import Job from '@/interfaces/job.interface.ts'

const route = useRoute()
const router = useRouter()
const snackbar = useSnackbarStore()
const job = ref<Job | null>(null)
const loading = ref(true)
const dialog = ref(false)

onMounted(async () => {
  const jobFromState = history.state as Job
  if (jobFromState?.id) {
    job.value = jobFromState
    loading.value = false
    return
  }

  const jobId = route.params.id as string
  if (jobId) {
    const docRef = doc(db, 'jobs', jobId)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      job.value = { id: snapshot.id, ...snapshot.data() } as Job
    }
  }
  loading.value = false
})

const confirmDelete = async () => {
  if (!job.value?.id) return
  try {
    await deleteDoc(doc(db, 'jobs', job.value.id))

    snackbar.open('Job deleted successfully!', 'success')

    router.push('/')
  } catch (error) {
    console.error('Error deleting job:', error)
    snackbar.open('Failed to delete job!', 'error')
  }
}
</script>

<style scoped>
.container {
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
