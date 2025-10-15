import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Job } from '@/stores/JobsStore.ts'

import JobCard from '@/components/ui/JobCard.vue'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const mockJob: Job = {
  id: 'abc-123-def',
  title: 'Frontend Vue Specialist',
  company: 'InnovateTech',
  description: 'Building modern and scalable web applications.',
  type: 'Full-Time',
  location: 'Lviv',
  applyLink: 'https://innovatetech.com/apply-vue',
}

const VCardStub = { template: '<div class="v-card-stub"><slot /></div>', name: 'VCard' }
const VCardTitleStub = { template: '<h2 class="v-card-title-stub"><slot /></h2>', name: 'VCardTitle' }
const VCardSubtitleStub = { template: '<h3 class="v-card-subtitle-stub"><slot /></h3>', name: 'VCardSubtitle' }
const VCardTextStub = { template: '<div class="v-card-text-stub"><slot /></div>', name: 'VCardText' }
const VCardActionsStub = { template: '<div class="v-card-actions-stub"><slot /></div>', name: 'VCardActions' }

const VBtnStub = {
  template: '<button class="v-btn-stub" :href="href" :target="target" :rel="rel" :style="{ color: color }" @click="$emit(\'click\', $event)"><slot /></button>',
  name: 'VBtn',
  props: ['href', 'target', 'rel', 'color'],
}

const mountComponent = (job: Job) => {
  return shallowMount(JobCard, {
    props: { job },
    global: {
      stubs: {
        'VCard': VCardStub,
        'VCardTitle': VCardTitleStub,
        'VCardSubtitle': VCardSubtitleStub,
        'VCardText': VCardTextStub,
        'VCardActions': VCardActionsStub,
        'VBtn': VBtnStub,
      },
    },
  }) as VueWrapper<any>
}

describe('JobCard', () => {
  let wrapper: VueWrapper<any>
  let goToJobPageSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mountComponent(mockJob)
    goToJobPageSpy = vi.spyOn(wrapper.vm, 'goToJobPage')
  })

  it('sets the correct href and target attributes for the "Apply Now" button', () => {
    const applyButton = wrapper.findAllComponents({ name: 'VBtn' })[0]

    expect(applyButton.attributes('href')).toBe(mockJob.applyLink)
    expect(applyButton.attributes('target')).toBe('_blank')
    expect(applyButton.attributes('rel')).toBe('noopener')
  })

  const expectedNavigationCall = {
    path: `/${mockJob.id}`,
    state: mockJob,
  }

  it('navigates when the entire card is clicked', async () => {
    wrapper.vm.goToJobPage()

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith(expectedNavigationCall)
  })

  it('does not navigate/call router.push when the "Apply Now" button is clicked (relies on href)', async () => {
    const applyButton = wrapper.findAllComponents({ name: 'VBtn' })[0]

    await applyButton.trigger('click')

    expect(goToJobPageSpy).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()

    goToJobPageSpy.mockRestore()
  })
})
