import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref, type Ref, type ComponentPublicInstance } from 'vue'
import JobsFeed from '@/components/feeds/JobsFeed.vue'

interface Job {
  id: number | string
  title: string
}

interface PaginationProps {
  currentPage: number
  totalPages: number
}

type PaginationWrapper = VueWrapper<ComponentPublicInstance<PaginationProps>>

const mockJobs: Job[] = [
  { id: 1, title: 'Job A' },
  { id: 2, title: 'Job B' },
  { id: 3, title: 'Job C' },
  { id: 4, title: 'Job D' },
  { id: 5, title: 'Job E' },
  { id: 6, title: 'Job F' },
  { id: 7, title: 'Job G' },
  { id: 8, title: 'Job H' },
  { id: 9, title: 'Job I' },
  { id: 10, title: 'Job J' },
  { id: 11, title: 'Job K' },
]

const filteredJobs: Ref<Job[]> = ref([])
const loading: Ref<boolean> = ref(false)
const error: Ref<string | null> = ref(null)
const getJobs = vi.fn<[], Promise<void>>() // Explicitly type spy fn

vi.mock('@/stores/JobsStore.ts', () => ({
  useJobsStore: () => ({
    filteredJobs,
    loading,
    error,
    getJobs,
  }),
}))

describe('JobsFeed.vue', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>

  beforeEach(() => {
    setActivePinia(createPinia())
    filteredJobs.value = []
    loading.value = false
    error.value = null
    getJobs.mockClear()

    wrapper = mount(JobsFeed, {
      global: {
        stubs: {
          JobCard: {
            props: ['job'],
            template:
              '<div data-testid="job-card">{{ job.title }} ({{ job.id }})</div>',
          },
          Pagination: {
            name: 'Pagination',
            props: ['currentPage', 'totalPages'],
            emits: ['update:currentPage'],
            template:
              '<div data-testid="pagination">Page: {{ currentPage }} / Total: {{ totalPages }}</div>',
          },
        },
      },
    })
  })

  it('calls jobsStore.getJobs() on mounted', () => {
    expect(getJobs).toHaveBeenCalledOnce()
  })

  it('renders the main heading', () => {
    expect(wrapper.find('h1').text()).toBe('Current Jobs')
  })

  it('renders loading state when jobs are being fetched', async () => {
    loading.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Loading jobs...')
    expect(wrapper.find('[data-testid="job-card"]').exists()).toBe(false)
  })

  it('renders error state when an error occurs', async () => {
    error.value = 'Failed to connect to server'
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Error: Failed to connect to server')
    expect(wrapper.find('[data-testid="job-card"]').exists()).toBe(false)
  })

  it('renders "No jobs found" when filteredJobs is empty', async () => {
    filteredJobs.value = []
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('No jobs found.')
    expect(wrapper.find('[data-testid="job-card"]').exists()).toBe(false)
  })

  it('renders 10 JobCards and Pagination when jobs are available', async () => {
    filteredJobs.value = mockJobs
    await wrapper.vm.$nextTick()

    const jobCards = wrapper.findAll('[data-testid="job-card"]')
    expect(jobCards).toHaveLength(10)
    expect(jobCards[0].text()).toContain(`Job A (${mockJobs[0].id})`)

    const pagination = wrapper.find('[data-testid="pagination"]')
    expect(pagination.exists()).toBe(true)
    expect(pagination.text()).toContain('Total: 2')
  })

  it('correctly calculates totalPages for empty and full data sets', async () => {
    const getPaginationStub = (): PaginationWrapper =>
      wrapper.findComponent({ name: 'Pagination' }) as PaginationWrapper

    filteredJobs.value = []
    await wrapper.vm.$nextTick()
    expect(getPaginationStub().props('totalPages')).toBe(1)

    filteredJobs.value = mockJobs
    await wrapper.vm.$nextTick()
    expect(getPaginationStub().props('totalPages')).toBe(2)

    filteredJobs.value = mockJobs.slice(0, 5)
    await wrapper.vm.$nextTick()
    expect(getPaginationStub().props('totalPages')).toBe(1)
  })

  it('updates paginatedJobs when currentPage changes (Pagination logic)', async () => {
    filteredJobs.value = mockJobs
    await wrapper.vm.$nextTick()

    const paginationStub = wrapper.findComponent({
      name: 'Pagination',
    }) as PaginationWrapper

    expect(wrapper.findAll('[data-testid="job-card"]')).toHaveLength(10)

    await paginationStub?.vm.$emit('update:currentPage', 2)
    await wrapper.vm.$nextTick()

    const jobCardsPage2 = wrapper.findAll('[data-testid="job-card"]')
    expect(jobCardsPage2).toHaveLength(1)
    expect(jobCardsPage2[0].text()).toContain('Job K (11)')
  })
})
