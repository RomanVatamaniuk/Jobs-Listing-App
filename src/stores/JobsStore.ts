import { defineStore } from 'pinia'
import { collection, getDocs, onSnapshot, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore"
import { db } from "../firebase.ts"
import { ref, computed, type Ref } from 'vue'
import firebase from 'firebase/compat/app'
import FirestoreError = firebase.firestore.FirestoreError

export const useJobsStore = defineStore('jobsStore', () => {
  const jobs: Ref<Job[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const selectedType: Ref<string | null> = ref(null)
  const selectedLocation: Ref<string | null> = ref(null)

  const filteredJobs = computed<Job[]>(() =>
    jobs.value.filter((job: Job) => {
      const typeMatch: boolean =
        selectedType.value === null || job.type === selectedType.value
      const locationMatch: boolean =
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
                applyLink: data.applyLink ?? '',
              }
            }
          )
          jobs.value = arr
          loading.value = false
        },
        (err:  FirestoreError): void => {
          error.value = err.message
          loading.value = false
        }
      )
    } catch (err: any) {
      error.value = err.message
      loading.value = false
    }
  }

  const addJob = async (job: Omit<Job, 'id'>): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const jobsRef = collection(db, 'jobs')
      await addDoc(jobsRef, job)
    } catch (err: Error) {
      error.value = err.message
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
    } catch (err) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    updateJob,
  }
})
