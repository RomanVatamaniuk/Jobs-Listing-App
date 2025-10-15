import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

import JobsFilter from '@/components/ui/JobsFilter.vue'

const selectedTypeRef = ref<string | null>(null)
const selectedLocationRef = ref<string | null>(null)

const mockJobsStore = {
  selectedType: selectedTypeRef,
  selectedLocation: selectedLocationRef,
}

vi.mock('@/stores/JobsStore.ts', () => ({
  useJobsStore: vi.fn(() => mockJobsStore),
}))

const VSelectStub = {
  template: '<div class="v-select-stub"><slot /></div>',
  name: 'VSelect',
  props: ['label', 'items', 'modelValue', 'clearable'],
}

const mountComponent = () => {
  return shallowMount(JobsFilter, {
    global: {
      stubs: {
        'VSelect': VSelectStub,
      },
    },
  }) as VueWrapper<any>
}

describe('JobsFilter', () => {
  let wrapper: VueWrapper<any>
  let typeSelect: VueWrapper<any>
  let locationSelect: VueWrapper<any>

  const expectedTypes = ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Freelance', 'Other']
  const expectedLocations = ['Remote', 'Lviv', 'Kyiv', 'Ivano-Frankivsk', 'Dnipro', 'Abroad']

  beforeEach(() => {
    selectedTypeRef.value = null
    selectedLocationRef.value = null

    wrapper = mountComponent()

    const selects = wrapper.findAllComponents(VSelectStub)
    typeSelect = selects[0]
    locationSelect = selects[1]
  })


  it('renders two VSelect components', () => {
    const selects = wrapper.findAllComponents(VSelectStub)
    expect(selects.length).toBe(2)
  })

  it('correctly sets props for the "Type of Job" selector', () => {
    expect(typeSelect.props('label')).toBe('Type of Job')
    expect(typeSelect.props('items')).toEqual(expectedTypes)
    expect(typeSelect.props('modelValue')).toBe(null)
    expect(typeSelect.props('clearable')).toBe('')
  })

  it('correctly sets props for the "Location" selector', () => {
    expect(locationSelect.props('label')).toBe('Location')
    expect(locationSelect.props('items')).toEqual(expectedLocations)
    expect(locationSelect.props('modelValue')).toBe(null)
    expect(locationSelect.props('clearable')).toBe('')
  })


  it('updates the store\'s selectedType when the job type selector changes', async () => {
    const newType = 'Part-Time'

    await typeSelect.vm.$emit('update:modelValue', newType)

    expect(selectedTypeRef.value).toBe(newType)
  })

  it('updates the store\'s selectedLocation when the location selector changes', async () => {
    const newLocation = 'Remote'

    await locationSelect.vm.$emit('update:modelValue', newLocation)

    expect(selectedLocationRef.value).toBe(newLocation)
  })
})
