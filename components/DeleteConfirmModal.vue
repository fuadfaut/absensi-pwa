<template>
  <div class="modal-overlay">
    <div class="modal-content text-center">
      <div class="flex items-center justify-center mb-4">
        <IconLibrary name="alert" size="xl" class="mr-3 text-red-600" />
        <h3 class="text-xl font-bold text-red-700">Konfirmasi Hapus</h3>
      </div>
      <p class="my-4 text-gray-600">Apakah Anda yakin ingin menghapus data absensi ini?</p>
      <div class="flex justify-center gap-4">
        <button
          @click="$emit('confirm')"
          class="btn-danger px-6 py-2"
        >
          <IconLibrary name="delete" size="sm" class="mr-2" />
          Ya, Hapus
        </button>
        <button
          @click="$emit('cancel')"
          class="btn-secondary px-6 py-2"
        >
          <IconLibrary name="x" size="sm" class="mr-2" />
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconLibrary from './icons/IconLibrary.vue'

defineEmits(['confirm', 'cancel'])
</script>
