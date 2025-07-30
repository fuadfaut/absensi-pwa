<template>
  <div class="modal-overlay">
    <div class="modal-content text-left">
      <div class="flex items-center mb-4">
        <IconLibrary name="user" size="xl" class="mr-3 text-blue-600" />
        <h3 class="text-xl font-bold text-gray-900">Lengkapi Profil Anda</h3>
      </div>
      <p class="text-gray-600 mb-6">Silakan isi nama dan jabatan Anda untuk melanjutkan.</p>
      <div class="space-y-4">
        <div>
          <label for="setupProfileName" class="block text-sm font-medium text-gray-700">Nama</label>
          <input
            type="text"
            id="setupProfileName"
            :value="profileName || ''"
            @input="$emit('update:profile-name', $event.target.value)"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            :placeholder="profileName && profileName.trim() !== '' ? '' : 'Nama Lengkap'"
          />
        </div>
        <div>
          <label for="setupProfileJabatan" class="block text-sm font-medium text-gray-700">Jabatan</label>
          <input
            type="text"
            id="setupProfileJabatan"
            :value="profileJabatan || ''"
            @input="$emit('update:profile-jabatan', $event.target.value)"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            :placeholder="profileJabatan && profileJabatan.trim() !== '' ? '' : 'Jabatan Anda'"
          />
        </div>
        <button
          @click="$emit('save')"
          :disabled="!profileName || !profileJabatan"
          class="btn-primary mt-4 w-full"
          :class="(!profileName || !profileJabatan) ? 'opacity-50 cursor-not-allowed' : ''"
        >
          <IconLibrary name="save" size="sm" class="mr-2" />
          Simpan & Lanjutkan
        </button>

        <!-- Import Data Option -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-600 mb-3">
            Atau jika Anda sudah memiliki data backup:
          </p>
          <label class="btn-secondary w-full cursor-pointer inline-flex items-center justify-center">
            <IconLibrary name="upload" size="sm" class="mr-2" />
            Import Data Backup
            <input
              type="file"
              @change="handleImportData"
              class="hidden"
              accept=".json"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import IconLibrary from './icons/IconLibrary.vue'
import { useAttendance } from '~/composables/useAttendance'

const props = defineProps({
  profileName: {
    type: String,
    required: true
  },
  profileJabatan: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:profile-name', 'update:profile-jabatan', 'save', 'show-message'])

// Import data handler
const handleImportData = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.profile && data.attendances && data.profile.name && data.profile.jabatan) {
        const { attendances, saveData, reloadDataAfterImport } = useAttendance()

        // Import data
        attendances.value = data.attendances

        // Update profile data
        emit('update:profile-name', data.profile.name)
        emit('update:profile-jabatan', data.profile.jabatan)

        // Save and reload
        saveData()
        reloadDataAfterImport()

        emit('show-message', `Data berhasil diimpor! ${data.attendances.length} entri absensi dan profil telah dipulihkan.`, 'success')

        // Auto save after import
        setTimeout(() => {
          emit('save')
        }, 500)
      } else {
        emit('show-message', 'Format file tidak valid. Pastikan file backup berisi data profil dan absensi yang lengkap.', 'error')
      }
    } catch (error) {
      emit('show-message', 'Gagal membaca file backup. Pastikan file dalam format JSON yang valid.', 'error')
      console.error('Error importing backup data:', error)
    }
  }
  reader.readAsText(file)
  event.target.value = '' // Clear the file input
}
</script>
