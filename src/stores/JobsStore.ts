import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  setDoc,
  type QueryDocumentSnapshot,
  type DocumentData
} from 'firebase/firestore'
import { db } from '../firebase'
import { ref, computed, type Ref } from 'vue'
import type { Job } from '@/interfaces/job.interface'

export const useJobsStore = defineStore('jobsStore', () => {
  const jobs: Ref<Job[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const selectedType = ref<string | null>(null)
  const selectedLocation = ref<string | null>(null)

  const filteredJobs = computed(() =>
    jobs.value.filter((job: Job) => {
      const typeMatch =
        selectedType.value === null || job.type === selectedType.value
      const locationMatch =
        selectedLocation.value === null || job.location === selectedLocation.value
      return typeMatch && locationMatch
    })
  )

  const getJobs = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const q = collection(db, 'jobs')
      onSnapshot(
        q,
        (querySnapshot) => {
          const arr: Job[] = querySnapshot.docs.map(
            (docItem: QueryDocumentSnapshot<DocumentData>): Job => {
              const data = docItem.data() as Partial<Job>
              return {
                id: docItem.id,
                title: data.title ?? '',
                description: data.description ?? '',
                company: data.company ?? '',
                type: data.type ?? '',
                location: data.location ?? '',
                applyLink: data.applyLink ?? ''
              }
            }
          )
          jobs.value = arr
          loading.value = false
        },
        (err: any): void => {
          error.value = err.message
          loading.value = false
        }
      )
    } catch (err: unknown) {
      if (err instanceof Error) error.value = err.message
      else error.value = String(err)
      loading.value = false
    }
  }

  const addJob = async (job: Omit<Job, 'id'>): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const jobsRef = collection(db, 'jobs')
      await addDoc(jobsRef, job)
    } catch (err: unknown) {
      if (err instanceof Error) error.value = err.message
      else error.value = String(err)
    } finally {
      loading.value = false
    }
  }

  const deleteJob = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const jobRef = doc(db, 'jobs', id)
      await deleteDoc(jobRef)
      jobs.value = jobs.value.filter((job: Job) => job.id !== id)
    } catch (err: unknown) {
      if (err instanceof Error) error.value = err.message
      else error.value = String(err)
    } finally {
      loading.value = false
    }
  }

  const updateJob = async (job: Job): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const jobRef = doc(db, 'jobs', job.id)
      await setDoc(jobRef, job)
      const index = jobs.value.findIndex((j: Job) => j.id === job.id)
      if (index !== -1) jobs.value[index] = job
    } catch (err: unknown) {
      if (err instanceof Error) error.value = err.message
      else error.value = String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    filteredJobs,
    selectedType,
    selectedLocation,
    loading,
    error,
    getJobs,
    addJob,
    deleteJob,
    updateJob
  }
})
