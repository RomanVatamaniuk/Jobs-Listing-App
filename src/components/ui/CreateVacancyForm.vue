<template>
  <form @submit.prevent="handleSubmit">
    <v-text-field
      v-model="form.title"
      :counter="30"
      label="Job Title"
      :rules="[v => !!v || 'Title is required']"
      required
    ></v-text-field>

    <v-text-field
      v-model="form.company"
      :counter="30"
      label="Company"
      :rules="[v => !!v || 'Company is required']"
      required
    ></v-text-field>

    <v-textarea
      v-model="form.description"
      label="Description"
      :rules="[v => !!v || 'Description is required']"
      required
    ></v-textarea>

    <v-text-field
      v-model="form.applyLink"
      label="Link"
      :rules="[
        v => !!v || 'Link is required',
        v => /^(https?:\/\/)/.test(v) || 'Must be a valid URL'
      ]"
      required
    ></v-text-field>

    <div class="d-flex flex-row">
      <v-select
        class="mr-4"
        v-model="form.type"
        label="Type of Job"
        :items="typeOfJobSelect"
        :rules="[v => !!v || 'Select a job type']"
        required
      ></v-select>

      <v-select
        v-model="form.location"
        label="Location"
        :items="locationSelect"
        :rules="[v => !!v || 'Select a location']"
        required
      ></v-select>
    </div>

    <div class="d-flex flex-row justify-space-between mt-2">
      <v-btn
        type="submit"
        variant="outlined"
        color="primary"
        class="flex-grow-1 mr-2"
        :loading="jobsStore.loading"
      >
        {{ isEdit ? 'Edit' : 'Submit' }}
      </v-btn>

      <v-btn
        to="/"
        router
        color="error"
        variant="outlined"
        class="flex-grow-1 ml-2"
      >
        Cancel
      </v-btn>
    </div>

    <ConfirmDialog
      v-model="confirmDialog"
      message="Do you want to apply edits?"
      @confirm="applyEdits"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/JobsStore.ts'
import type { Job } from '@/stores/JobsStore.ts'
import ConfirmDialog from './ConfirmDialog.vue'
import { useSnackbarStore } from '@/stores/SnackbarStore.ts'

const router = useRouter()
const jobsStore = useJobsStore()
const props = defineProps<{ job?: Job }>()

const isEdit = ref(false)
const confirmDialog = ref(false)

const form = ref<Job>({
  id: '',
  title: '',
  company: '',
  description: '',
  type: '',
  location: '',
  applyLink: ''
})

const snackbarStore = useSnackbarStore()


const typeOfJobSelect: string[] = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance', 'Other']
const locationSelect: string[] = ['Remote', 'Lviv', 'Kyiv', 'Ivano-Frankivsk', 'Dnipro', 'Abroad']

watch(
  () => props.job,
  (newJob) => {
    if (newJob) {
      form.value = { ...newJob }
      isEdit.value = true
    } else {
      form.value.id = crypto.randomUUID()
      isEdit.value = false
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.title || !form.value.company || !form.value.description || !form.value.type || !form.value.location || !form.value.applyLink) {
    snackbar.value = { show: true, message: 'Please fill in all fields!', color: 'error' }
    return
  }

  if (isEdit.value) {
    confirmDialog.value = true
  } else {
    addJob()
  }
}

const applyEdits = async () => {
  await jobsStore.updateJob(form.value)
  snackbarStore.open('Job updated successfully!')
  router.push('/')
}

const addJob = async () => {
  await jobsStore.addJob(form.value)
  snackbarStore.open('Job added successfully!')
  router.push('/')
}
</script>
