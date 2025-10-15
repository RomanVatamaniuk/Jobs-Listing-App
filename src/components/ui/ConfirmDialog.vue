<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card>
      <v-card-title class="text-h6 text-center mt-10">
        {{ message }}
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="cancel">No</v-btn>
        <v-btn color="red" text @click="confirm">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: boolean
  message: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm'])

const cancel = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>
