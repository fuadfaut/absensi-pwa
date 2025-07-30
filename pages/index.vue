<template>
  <div>
    <!-- Profile Setup Modal -->
    <ProfileSetupModal
      v-if="showProfileSetupModal"
      :profile-name="profileName"
      :profile-jabatan="profileJabatan"
      @update:profile-name="profileName = $event"
      @update:profile-jabatan="profileJabatan = $event"
      @save="saveProfile"
      @show-message="showMessage"
    />

    <!-- Message Box -->
    <MessageBox
      v-if="message"
      :message="message"
      :type="messageType"
      :fading-out="messageFadingOut"
    />

    <!-- Quick Actions Section -->
    <section class="card mb-6">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <IconLibrary name="clock" size="lg" class="mr-3 text-blue-600" />
        Aksi Cepat (Hari Ini)
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="quickCheckIn"
          :disabled="hasCheckedInTodayQuickAction"
          :class="hasCheckedInTodayQuickAction ? 'opacity-50 cursor-not-allowed transform-none' : 'btn-success'"
          class="flex-1 flex items-center justify-center"
        >
          <IconLibrary name="check-in" size="md" class="mr-2" />
          Check-in
        </button>
        <button
          @click="quickCheckOut"
          :disabled="!hasCheckedInTodayQuickAction || hasCheckedOutTodayQuickAction"
          :class="(!hasCheckedInTodayQuickAction || hasCheckedOutTodayQuickAction) ? 'opacity-50 cursor-not-allowed transform-none' : 'btn-danger'"
          class="flex-1 flex items-center justify-center"
        >
          <IconLibrary name="check-out" size="md" class="mr-2" />
          Check-out
        </button>
      </div>
    </section>

    <!-- Manual Input Section -->
    <section class="card mb-6">
      <h2 class="text-xl font-semibold mb-6 text-gray-800 flex items-center">
        <IconLibrary name="edit" size="lg" class="mr-3 text-blue-600" />
        Input Manual Absensi
      </h2>
      <div class="space-y-6">
        <div>
          <label class="form-label">Tanggal</label>
          <input
            type="date"
            v-model="selectedDate"
            class="form-input"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="checkInTime" class="form-label">Check-in</label>
            <input
              type="time"
              id="checkInTime"
              v-model="currentAttendanceForm.checkIn"
              class="form-input"
            />
          </div>
          <div>
            <label for="checkOutTime" class="form-label">Check-out</label>
            <input
              type="time"
              id="checkOutTime"
              v-model="currentAttendanceForm.checkOut"
              class="form-input"
            />
          </div>
        </div>
        <div>
          <label for="notes" class="form-label">Catatan Tambahan</label>
          <textarea
            id="notes"
            v-model="currentAttendanceForm.notes"
            rows="3"
            class="form-input resize-none"
            placeholder="Tambahkan catatan jika diperlukan..."
          ></textarea>
        </div>
      </div>
      <button
        @click="saveAttendance"
        :disabled="!currentAttendanceForm.checkIn"
        :class="!currentAttendanceForm.checkIn ? 'opacity-50 cursor-not-allowed transform-none' : 'btn-primary'"
        class="mt-6 w-full flex items-center justify-center"
      >
        <IconLibrary name="save" size="md" class="mr-2" />
        Simpan Absensi Manual
      </button>
    </section>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import IconLibrary from '~/components/icons/IconLibrary.vue'
import { useAttendance } from '~/composables/useAttendance'

// Use the attendance composable
const {
  // State
  attendances,
  profileName,
  profileJabatan,
  selectedDate,
  currentAttendanceForm,
  showProfileSetupModal,
  message,
  messageType,
  messageFadingOut,

  // Computed
  hasCheckedInTodayQuickAction,
  hasCheckedOutTodayQuickAction,

  // Methods
  saveProfile,
  saveAttendance,
  quickCheckIn,
  quickCheckOut,
  loadData,
  showMessage
} = useAttendance()

// Watch for selectedDate changes to update form
watch(selectedDate, (newDate) => {
  const entry = attendances.value.find(att => att.date === newDate)
  currentAttendanceForm.value = {
    date: newDate,
    checkIn: entry?.checkIn || null,
    checkOut: entry?.checkOut || null,
    notes: entry?.notes || ''
  }
}, { immediate: true })

// Load data on mount
onMounted(() => {
  loadData()
})

// Set page title
useHead({
  title: 'Rekap Absensi - Aplikasi Absensi PWA'
})
</script>
