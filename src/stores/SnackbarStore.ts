import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const show = ref(false)
  const message = ref('')
  const color = ref('success')

  const open = (msg: string, col = 'success') => {
    message.value = msg
    color.value = col
    show.value = true
  }

  const close = () => {
    show.value = false
  }

  return { show, message, color, open, close }
})
