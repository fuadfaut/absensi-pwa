<template>
  <div>
    <!-- Message Box -->
    <MessageBox 
      v-if="message" 
      :message="message" 
      :type="messageType" 
      :fading-out="messageFadingOut" 
    />

    <!-- Sub-tabs -->
    <div class="sub-tab-container">
      <div
        @click="activeHistoryTab = 'laporan'"
        class="sub-tab flex items-center justify-center"
        :class="{ 'active': activeHistoryTab === 'laporan' }"
      >
        <IconLibrary name="chart" size="sm" class="mr-2" />
        Laporan
      </div>
      <div
        @click="activeHistoryTab = 'daftar'"
        class="sub-tab flex items-center justify-center"
        :class="{ 'active': activeHistoryTab === 'daftar' }"
      >
        <IconLibrary name="list" size="sm" class="mr-2" />
        Daftar
      </div>
    </div>

    <!-- Laporan Tab -->
    <div v-if="activeHistoryTab === 'laporan'">
      <section class="bg-white p-4 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <IconLibrary name="chart" size="lg" class="mr-3 text-blue-600" />
          Laporan Bulanan
        </h2>
        
        <!-- Date Navigation -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="navigateMonth('prev')"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Bulan Sebelumnya"
          >
            <IconLibrary name="chevron-left" size="sm" class="text-gray-600" />
          </button>

          <div class="flex-1 mx-3 text-center">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ months[selectedMonth] }} {{ selectedYear }}
            </h3>
          </div>

          <button
            @click="navigateMonth('next')"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Bulan Berikutnya"
          >
            <IconLibrary name="chevron-right" size="sm" class="text-gray-600" />
          </button>
        </div>

        <!-- Month/Year Selector (Alternative) -->
        <div class="flex gap-2 mb-4">
          <select v-model="selectedMonth" class="w-full p-2 border border-gray-300 rounded-md">
            <option v-for="(month, index) in months" :key="index" :value="index">
              {{ month }}
            </option>
          </select>
          <select v-model="selectedYear" class="w-full p-2 border border-gray-300 rounded-md">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Summary Cards -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="rounded-lg bg-blue-100 p-4 text-center">
            <p class="text-sm font-medium text-blue-800">Total Hari</p>
            <p class="text-2xl font-bold text-blue-900">{{ summary.totalDays }}</p>
          </div>
          <div class="rounded-lg bg-green-100 p-4 text-center">
            <p class="text-sm font-medium text-green-800">Total Hadir</p>
            <p class="text-2xl font-bold text-green-900">{{ summary.totalPresent }}</p>
          </div>
          <div class="rounded-lg bg-yellow-100 p-4 text-center">
            <p class="text-sm font-medium text-yellow-800">Hanya CI</p>
            <p class="text-2xl font-bold text-yellow-900">{{ summary.onlyCheckIn }}</p>
          </div>
          <div class="rounded-lg bg-red-100 p-4 text-center">
            <p class="text-sm font-medium text-red-800">Tidak Absen</p>
            <p class="text-2xl font-bold text-red-900">{{ summary.totalAbsent }}</p>
          </div>
        </div>

        <!-- Report Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Tanggal</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CI</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">CO</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Durasi</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="report in monthlyReport" :key="report.date">
                <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {{ formatDate(report.date, { day: 'numeric', month: 'short' }) }}
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ report.checkIn || '-' }}</td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ report.checkOut || '-' }}</td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ report.duration }}</td>
                <td class="whitespace-nowrap px-4 py-2">
                  <span :class="getStatusClass(report.status)">{{ report.status }}</span>
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ report.notes || '-' }}</td>
              </tr>
              <tr v-if="monthlyReport.length === 0">
                <td colspan="6" class="text-center py-4 text-gray-500">
                  Tidak ada data untuk bulan ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Daftar Tab -->
    <div v-if="activeHistoryTab === 'daftar'">
      <section class="bg-white p-4 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <IconLibrary name="list" size="lg" class="mr-3 text-blue-600" />
          Daftar Absensi
        </h2>
        
        <!-- Date Navigation -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="navigateMonth('prev')"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Bulan Sebelumnya"
          >
            <IconLibrary name="chevron-left" size="sm" class="text-gray-600" />
          </button>

          <div class="flex-1 mx-3 text-center">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ months[selectedMonth] }} {{ selectedYear }}
            </h3>
          </div>

          <button
            @click="navigateMonth('next')"
            class="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Bulan Berikutnya"
          >
            <IconLibrary name="chevron-right" size="sm" class="text-gray-600" />
          </button>
        </div>

        <!-- Month/Year Selector (Alternative) -->
        <div class="flex gap-2 mb-4">
          <select v-model="selectedMonth" class="w-full p-2 border border-gray-300 rounded-md">
            <option v-for="(month, index) in months" :key="index" :value="index">
              {{ month }}
            </option>
          </select>
          <select v-model="selectedYear" class="w-full p-2 border border-gray-300 rounded-md">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <!-- Export/Import Buttons -->
        <HistoryExportImport
          :monthly-attendance="monthlyAttendance"
          :selected-month="selectedMonth"
          :selected-year="selectedYear"
          @show-message="showMessage"
          @data-imported="handleDataImported"
        />

        <!-- Data Summary -->
        <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <strong>Info:</strong>
          Total data absensi: {{ attendances.length }} |
          Data bulan ini ({{ months[selectedMonth] }} {{ selectedYear }}): {{ monthlyAttendance.length }}
        </div>

        <!-- Attendance List Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead>
              <tr>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Tanggal</th>
                <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Catatan</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="entry in monthlyAttendance" :key="entry.date">
                <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  {{ formatDate(entry.date) }} 
                  <br> 
                  <span class="text-xs text-gray-500">
                    CI: {{ entry.checkIn }} | CO: {{ entry.checkOut || '-' }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ entry.notes || '-' }}</td>
                <td class="whitespace-nowrap px-4 py-2 flex gap-2">
                  <button
                    @click="openEditModal(entry)"
                    class="inline-flex items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white hover:bg-indigo-700 transition-colors"
                    title="Edit Absensi"
                  >
                    <IconLibrary name="edit" size="sm" />
                  </button>
                  <button
                    @click="openDeleteModal(entry.date)"
                    class="inline-flex items-center justify-center rounded bg-red-600 p-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                    title="Hapus Absensi"
                  >
                    <IconLibrary name="delete" size="sm" />
                  </button>
                </td>
              </tr>
              <tr v-if="monthlyAttendance.length === 0">
                <td colspan="3" class="text-center py-4 text-gray-500">
                  Tidak ada data untuk bulan ini.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Edit Modal -->
    <EditAttendanceModal 
      v-if="showEditModal"
      :edit-form="editForm"
      @save="saveEditedAttendance"
      @cancel="cancelEditModal"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      v-if="showDeleteConfirmModal"
      @confirm="deleteAttendance"
      @cancel="cancelDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import IconLibrary from '~/components/icons/IconLibrary.vue'
import { useAttendance } from '~/composables/useAttendance'

// Use the attendance composable
const {
  // State
  attendances,
  selectedMonth,
  selectedYear,
  showEditModal,
  showDeleteConfirmModal,
  editForm,
  message,
  messageType,
  messageFadingOut,

  // Computed
  months,
  years,
  monthlyAttendance,
  monthlyReport,
  summary,

  // Methods
  formatDate,
  getStatusClass,
  showMessage,
  loadData,
  openEditModal,
  saveEditedAttendance,
  cancelEditModal,
  openDeleteModal,
  deleteAttendance,
  cancelDeleteModal,
  navigateMonth
} = useAttendance()

// Local state for history tab
const activeHistoryTab = ref('laporan')

// Handle data imported event
const handleDataImported = (importedCount) => {
  // Force reload data to ensure reactivity
  loadData()
}



// Load data on mount
onMounted(() => {
  loadData()
})

// Set page title
useHead({
  title: 'Riwayat Absensi - Aplikasi Absensi PWA'
})
</script>
