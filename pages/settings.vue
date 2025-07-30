<template>
  <div>
    <!-- Message Box -->
    <MessageBox 
      v-if="message" 
      :message="message" 
      :type="messageType" 
      :fading-out="messageFadingOut" 
    />

    <!-- Profile Management Section -->
    <section class="card mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
        <IconLibrary name="user" size="lg" class="mr-3 text-blue-600" />
        Manajemen Profil
      </h2>
      <div class="space-y-4">
        <div>
          <label for="profileName" class="block text-sm font-medium text-gray-700">Nama</label>
          <input 
            type="text" 
            id="profileName" 
            v-model="profileName" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" 
            placeholder="Nama Anda"
          />
        </div>
        <div>
          <label for="profileJabatan" class="block text-sm font-medium text-gray-700">Jabatan</label>
          <input 
            type="text" 
            id="profileJabatan" 
            v-model="profileJabatan" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2" 
            placeholder="Jabatan Anda"
          />
        </div>
        <button
          @click="saveProfile"
          class="btn-primary w-full mt-4"
        >
          <IconLibrary name="save" size="sm" class="mr-2" />
          Simpan Profil
        </button>
      </div>
    </section>

    <!-- App Settings Section -->
    <section class="card">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <IconLibrary name="settings" size="lg" class="mr-3 text-blue-600" />
        Pengaturan Aplikasi
      </h2>
      <div class="space-y-4">
        
        <!-- Data Management (JSON) -->
        <div class="rounded-lg border border-gray-200 p-4">
          <h3 class="font-medium text-gray-900">Manajemen Data (JSON)</h3>
          <p class="text-sm text-gray-500 mt-1">
            Ekspor semua data Anda ke sebuah file JSON, atau impor data dari file cadangan.
            Setelah import berhasil, Anda dapat langsung menggunakan aplikasi tanpa setup ulang.
          </p>
          <!-- Import Mode Selection -->
          <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 class="font-medium text-blue-800 mb-2">Mode Import:</h4>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="importMode"
                  value="replace"
                  class="mr-2"
                />
                <span class="text-sm text-blue-700">
                  <strong>Ganti Semua</strong> - Hapus data lama, ganti dengan data import
                </span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="importMode"
                  value="merge"
                  class="mr-2"
                />
                <span class="text-sm text-blue-700">
                  <strong>Gabung Data</strong> - Tambahkan ke data yang sudah ada
                </span>
              </label>
            </div>
          </div>

          <div class="mt-4 flex gap-2">
            <button
              @click="exportAllData"
              class="w-full inline-flex items-center justify-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              <IconLibrary name="download" size="sm" class="mr-2" />
              Ekspor JSON
            </button>
            <label class="w-full text-center inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer transition-colors">
              <IconLibrary name="upload" size="sm" class="mr-2" />
              Impor JSON
              <input
                type="file"
                @change="importAllData"
                class="hidden"
                accept=".json"
              />
            </label>
          </div>
        </div>

        <!-- Reset Application -->
        <div class="rounded-lg border border-red-200 p-4">
          <h3 class="font-medium text-red-900">Reset Aplikasi</h3>
          <p class="text-sm text-red-500 mt-1">
            Tindakan ini akan menghapus semua data profil dan absensi secara permanen.
          </p>
          <div class="mt-4">
            <button
              @click="handleResetClick"
              class="w-full inline-flex items-center justify-center rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              <IconLibrary name="refresh" size="sm" class="mr-2" />
              Reset Aplikasi
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Reset Confirmation Modal -->
    <ResetConfirmModal
      v-if="showResetConfirmModal"
      @confirm="handleConfirmReset"
      @cancel="cancelReset"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import IconLibrary from '~/components/icons/IconLibrary.vue'
import ResetConfirmModal from '~/components/ResetConfirmModal.vue'
import { useAttendance } from '~/composables/useAttendance'

// Local state for reset modal and import mode
const showResetConfirmModal = ref(false)
const importMode = ref('replace') // 'replace' or 'merge'

// Use the attendance composable
const {
  // State
  profileName,
  profileJabatan,
  message,
  messageType,
  messageFadingOut,

  // Methods
  saveProfile,
  showMessage,
  loadData,
  reloadDataAfterImport,
  forceCloseProfileModal
} = useAttendance()

// Settings methods
const exportAllData = () => {
  if (process.client) {
    const dataStr = localStorage.getItem('absensiApp_data')
    if (!dataStr) { 
      showMessage('Tidak ada data untuk diekspor.', 'error')
      return 
    }
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `absensi_backup_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showMessage('Data berhasil diekspor!', 'success')
  }
}

const importAllData = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.profile && data.attendances && data.profile.name && data.profile.jabatan) {
        const { attendances, saveData } = useAttendance()

        if (importMode.value === 'replace') {
          // Mode Ganti Semua: Replace semua data
          attendances.value = data.attendances
          profileName.value = data.profile.name || ''
          profileJabatan.value = data.profile.jabatan || ''
          console.log('Import replace mode - profile set to:', {
            name: profileName.value,
            jabatan: profileJabatan.value
          })
          showMessage(`Data berhasil diimpor! ${data.attendances.length} entri menggantikan data lama.`, 'success')
        } else {
          // Mode Gabung: Merge data
          const existingDates = new Set(attendances.value.map(att => att.date))
          const newEntries = data.attendances.filter(att => !existingDates.has(att.date))
          const updatedEntries = data.attendances.filter(att => existingDates.has(att.date))

          // Add new entries
          attendances.value.push(...newEntries)

          // Update existing entries (optional - bisa dikonfigurasi)
          updatedEntries.forEach(importedEntry => {
            const existingIndex = attendances.value.findIndex(att => att.date === importedEntry.date)
            if (existingIndex !== -1) {
              attendances.value[existingIndex] = importedEntry
            }
          })

          // Update profile only if current profile is empty
          if (!profileName.value || !profileJabatan.value) {
            profileName.value = data.profile.name
            profileJabatan.value = data.profile.jabatan
          }

          showMessage(`Data berhasil digabung! ${newEntries.length} entri baru ditambahkan, ${updatedEntries.length} entri diperbarui.`, 'success')
        }

        saveData()

        // Set flag immediately after saving data
        localStorage.setItem('absensiApp_recentImport', Date.now().toString())
        console.log('Import flag set immediately after save')

        // Force close any open profile modal and reload data
        forceCloseProfileModal()

        // Reload data without showing profile modal
        setTimeout(() => {
          reloadDataAfterImport()
          console.log('Import completed, data reloaded')
        }, 200)
      } else {
        if (!data.profile) {
          showMessage('File JSON tidak memiliki data profile.', 'error')
        } else if (!data.profile.name || !data.profile.jabatan) {
          showMessage('Data profile tidak lengkap. Pastikan ada nama dan jabatan.', 'error')
        } else if (!data.attendances) {
          showMessage('File JSON tidak memiliki data attendances.', 'error')
        } else {
          showMessage('Format file JSON tidak valid.', 'error')
        }
      }
    } catch (error) {
      showMessage('Gagal membaca file JSON. Pastikan file tidak rusak.', 'error')
      console.error('Import error:', error)
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

// Reset functions
const handleResetClick = () => {
  showResetConfirmModal.value = true
}

const cancelReset = () => {
  showResetConfirmModal.value = false
}

const handleConfirmReset = () => {
  try {
    if (process.client) {
      // Clear all localStorage data
      localStorage.removeItem('absensiApp_data')
      localStorage.removeItem('absensiApp_profile')
      localStorage.removeItem('absensiApp_settings')
      localStorage.removeItem('absensiApp_recentImport')

      showResetConfirmModal.value = false
      showMessage('Aplikasi berhasil direset. Halaman akan dimuat ulang...', 'success')

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    }
  } catch (error) {
    console.error('Error resetting app:', error)
    showMessage('Terjadi kesalahan saat mereset aplikasi.', 'error')
  }
}

// Load data on mount
onMounted(() => {
  loadData()
})

// Set page title
useHead({
  title: 'Pengaturan - Aplikasi Absensi PWA'
})
</script>
