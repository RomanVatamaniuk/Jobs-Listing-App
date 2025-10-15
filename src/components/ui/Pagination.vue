<template>
  <div class="pagination mt-4 d-flex justify-center">
    <v-btn
      :disabled="currentPage === 1"
      @click="changePage(currentPage - 1)"
      class="mx-1"
      outlined
    >
      Previous
    </v-btn>

    <v-btn
      v-for="page in totalPages"
      :key="page"
      :color="page === currentPage ? 'primary' : 'default'"
      @click="changePage(page)"
      class="mx-1"
      outlined
    >
      {{ page }}
    </v-btn>

    <v-btn
      :disabled="currentPage === totalPages"
      @click="changePage(currentPage + 1)"
      class="mx-1"
      outlined
    >
      Next
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:currentPage'])

const changePage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
.pagination {
  min-width: 36px;
}
</style>
