import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { type ComponentPublicInstance } from 'vue'

interface DialogProps {
  modelValue: boolean;
  message: string;
}

type DialogWrapper = VueWrapper<ComponentPublicInstance<DialogProps>>;

describe('ConfirmDialog.vue', () => {
  let wrapper: DialogWrapper;

  const factory = (props: DialogProps) => {
    wrapper = mount(ConfirmDialog, {
      props,
      global: {
        stubs: {
          'v-dialog': { template: '<div><slot/></div>' },
          'v-card': { template: '<div><slot/></div>' },
          'v-card-title': { template: '<div><slot/></div>' },
          'v-card-actions': { template: '<div><slot/></div>' },
          'v-spacer': { template: '<div/>' },

          'v-btn': {
            template: '<button :data-testid="($slots.default()[0].children === \'No\' ? \'cancel-btn\' : \'confirm-btn\')"><slot/></button>',
          },
        },
      },
    }) as DialogWrapper;
  };

  it('renders the correct message content', () => {
    const testMessage = 'Are you sure you want to delete this job?';
    factory({ modelValue: true, message: testMessage });

    expect(wrapper.text()).toContain(testMessage);
  });

  it('emits update:modelValue(false) when the "No" (cancel) button is clicked', async () => {
    factory({ modelValue: true, message: 'Test?' });

    const cancelButton = wrapper.find('[data-testid="cancel-btn"]');
    await cancelButton.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
    expect(wrapper.emitted('confirm')).toBeUndefined();
  });


  it('emits confirm and update:modelValue(false) when the "Yes" (confirm) button is clicked', async () => {
    factory({ modelValue: true, message: 'Test?' });

    const confirmButton = wrapper.find('[data-testid="confirm-btn"]');
    await confirmButton.trigger('click');

    expect(wrapper.emitted('confirm')).toHaveLength(1);

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });

  it('passes the update:modelValue event up when received from v-dialog', async () => {
    factory({ modelValue: true, message: 'Test?' });

    await wrapper.vm.$emit('update:modelValue', false);

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  });
});
