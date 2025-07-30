<template>
  <div class="modal-overlay">
    <div class="modal-content text-center max-w-lg">
      <div class="flex items-center justify-center mb-4">
        <IconLibrary name="alert" size="xl" class="mr-3 text-red-600" />
        <h3 class="text-xl font-bold text-red-700">Konfirmasi Reset Aplikasi</h3>
      </div>
      <div class="my-6">
        <p class="text-gray-600 mb-4">
          <strong>Peringatan:</strong> Tindakan ini akan menghapus semua data secara permanen, termasuk:
        </p>
        <ul class="text-left text-gray-600 space-y-2 mb-4 max-w-sm mx-auto">
          <li class="flex items-center">
            <IconLibrary name="x" size="sm" class="mr-2 text-red-500 flex-shrink-0" />
            Semua data absensi
          </li>
          <li class="flex items-center">
            <IconLibrary name="x" size="sm" class="mr-2 text-red-500 flex-shrink-0" />
            Profil pengguna (nama dan jabatan)
          </li>
          <li class="flex items-center">
            <IconLibrary name="x" size="sm" class="mr-2 text-red-500 flex-shrink-0" />
            Pengaturan aplikasi
          </li>
        </ul>
        <p class="text-red-600 font-medium">
          Data yang dihapus tidak dapat dikembalikan!
        </p>
      </div>
      <div class="flex justify-center gap-4">
        <button
          @click="$emit('confirm')"
          class="btn-danger px-6 py-2"
        >
          <IconLibrary name="refresh" size="sm" class="mr-2" />
          Ya, Reset Aplikasi
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
