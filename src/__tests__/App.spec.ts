import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'

import App from '@/App.vue'

import { useSnackbarStore } from '@/stores/SnackbarStore.ts'

const routes = [
  { path: '/', component: { template: '<div data-testid="jobs-view">Jobs View</div>' } },
  { path: '/create-vacancy', component: { template: '<div data-testid="create-view">Create Vacancy View</div>' } },
  { path: '/:pathMatch(.*)*', component: { template: '<div data-testid="404-view">Not Found</div>' } }
]

let router: Router
beforeEach(() => {
  setActivePinia(createPinia())

  router = createRouter({
    history: createWebHistory(),
    routes,
  })
})


describe('App.vue - Stubbed Vuetify Components', () => {
  let wrapper: VueWrapper<any>

  const factory = async () => {
    wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'v-snackbar': {
            props: ['modelValue', 'color', 'timeout'],
            template: `
              <div data-testid="snackbar-stub" :class="{ 'hidden-stub': !modelValue }" :style="{ display: modelValue ? 'block' : 'none', color: color }">
                <slot v-if="modelValue"/>
              </div>
            `
          },
          'Nav': { template: '<nav-stub/>' },
        },
      },
    })
    await router.isReady()
  }


  it('mounts and renders the main structural components', async () => {
    await factory()

    expect(wrapper.find('nav-stub').exists()).toBe(true)

    expect(wrapper.find('[data-testid="snackbar-stub"]').exists()).toBe(true)

    expect(wrapper.find('[data-testid="jobs-view"]').exists()).toBe(true)
  })


  it('displays the correct view when the route changes', async () => {
    await factory()

    expect(wrapper.find('[data-testid="jobs-view"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="create-view"]').exists()).toBe(false)

    await router.push('/create-vacancy')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="jobs-view"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="create-view"]').exists()).toBe(true)
  })


  it('displays the snackbar stub content based on Pinia state', async () => {
    await factory()

    const snackbarStore = useSnackbarStore()
    const snackbarStub = wrapper.find('[data-testid="snackbar-stub"]')


    expect(snackbarStub.text()).toBeFalsy()

    snackbarStore.show = true
    snackbarStore.message = 'An important alert!'
    snackbarStore.color = 'error'

    await wrapper.vm.$nextTick()

    expect(snackbarStub.text()).toContain('An important alert!')

    snackbarStore.show = false
    await wrapper.vm.$nextTick()

    expect(snackbarStub.text()).toBeFalsy()
  })
})
