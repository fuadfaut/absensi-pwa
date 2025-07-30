/**
 * Composable for managing attendance data and operations
 * Migrated from the original HTML file Vue.js logic
 */
import { ref, computed, watch, onMounted } from 'vue'

export const useAttendance = () => {
  // --- STATE MANAGEMENT ---
  const attendances = ref([])
  const profileName = ref('')
  const profileJabatan = ref('')
  
  const today = new Date()
  const todayDateString = today.toISOString().split('T')[0]
  const selectedDate = ref(todayDateString)
  const currentAttendanceForm = ref({ 
    date: selectedDate.value, 
    checkIn: null, 
    checkOut: null, 
    notes: '' 
  })
  
  const selectedMonth = ref(today.getMonth())
  const selectedYear = ref(today.getFullYear())

  // Modals and Messages
  const showProfileSetupModal = ref(false)
  const showEditModal = ref(false)
  const showDeleteConfirmModal = ref(false)
  const itemToDelete = ref(null)
  const showResetConfirmModal = ref(false)
  const message = ref('')
  const messageType = ref('')
  const messageTimeout = ref(null)
  const messageFadingOut = ref(false)
  const editForm = ref({ 
    date: null, 
    checkIn: null, 
    checkOut: null, 
    name: null, 
    notes: '' 
  })
  const originalEditEntryDate = ref(null)

  // --- COMPUTED PROPERTIES ---
  const isProfileComplete = computed(() => !!profileName.value && !!profileJabatan.value)
  const months = ref([
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ])
  const years = computed(() => Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i))
  const todayAttendanceEntry = computed(() => 
    attendances.value.find(att => att.date === todayDateString)
  )
  const hasCheckedInTodayQuickAction = computed(() => !!todayAttendanceEntry.value?.checkIn)
  const hasCheckedOutTodayQuickAction = computed(() => !!todayAttendanceEntry.value?.checkOut)

  const monthlyAttendance = computed(() => {
    return attendances.value
      .filter(att => {
        const attDate = new Date(att.date + 'T00:00:00')
        return attDate.getMonth() === selectedMonth.value && attDate.getFullYear() === selectedYear.value
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  })

  const monthlyReport = computed(() => {
    const year = selectedYear.value
    const month = selectedMonth.value
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const report = []
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const dateString = date.toISOString().split('T')[0]
      const entry = monthlyAttendance.value.find(e => e.date === dateString)
      const data = { 
        date: dateString, 
        checkIn: entry?.checkIn || null, 
        checkOut: entry?.checkOut || null, 
        duration: '-', 
        status: 'Tidak Absen', 
        notes: entry?.notes || null 
      }
      
      if (entry?.checkIn && entry?.checkOut) {
        data.status = 'Hadir'
        data.duration = calculateDuration(entry.checkIn, entry.checkOut)
      } else if (entry?.checkIn) {
        data.status = 'Hanya CI'
      }
      
      report.push(data)
    }
    return report
  })

  const summary = computed(() => {
    const report = monthlyReport.value
    return {
      totalDays: report.length,
      totalPresent: report.filter(d => d.status === 'Hadir').length,
      onlyCheckIn: report.filter(d => d.status === 'Hanya CI').length,
      totalAbsent: report.filter(d => d.status === 'Tidak Absen').length,
    }
  })

  // --- HELPER METHODS ---
  const calculateDuration = (checkIn, checkOut) => {
    const start = new Date(`1970-01-01T${checkIn}`)
    const end = new Date(`1970-01-01T${checkOut}`)
    const diff = end - start
    if (diff < 0) return '-'
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  const getStatusClass = (status) => {
    const classes = { 
      'Hadir': 'bg-green-100 text-green-700', 
      'Hanya CI': 'bg-yellow-100 text-yellow-700', 
      'Tidak Absen': 'bg-red-100 text-red-700' 
    }
    return `inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm ${classes[status] || ''}`
  }

  const formatDate = (dateString, options = { day: 'numeric', month: 'long', year: 'numeric' }) => 
    new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', options)
  
  const getCurrentTime = () => new Date().toTimeString().slice(0, 5)

  const showMessage = (msg, type) => {
    if (messageTimeout.value) clearTimeout(messageTimeout.value)
    message.value = msg
    messageType.value = type
    messageFadingOut.value = false
    messageTimeout.value = setTimeout(() => {
      messageFadingOut.value = true
      setTimeout(() => {
        message.value = ''
        messageType.value = ''
        messageFadingOut.value = false
      }, 150)
    }, 3000)
  }

  // --- DATA PERSISTENCE METHODS ---
  const loadData = (skipProfileCheck = false) => {
    if (process.client) {
      const data = JSON.parse(localStorage.getItem('absensiApp_data') || '{}')
      if (data) {
        attendances.value = data.attendances || []
        profileName.value = data.profile?.name || ''
        profileJabatan.value = data.profile?.jabatan || ''
      }

      // Check if data was recently imported (flag expires after 10 seconds)
      const importFlag = localStorage.getItem('absensiApp_recentImport')
      const isRecentImport = importFlag && (Date.now() - parseInt(importFlag)) < 10000

      console.log('LoadData check:', {
        skipProfileCheck,
        profileComplete: !!(profileName.value && profileJabatan.value),
        isRecentImport,
        timeDiff: importFlag ? Date.now() - parseInt(importFlag) : null
      })

      // Only show profile setup modal if:
      // 1. Not skipping profile check
      // 2. Profile is incomplete (name OR jabatan is empty/null/undefined)
      // 3. No recent import happened
      const profileIncomplete = !profileName.value || !profileJabatan.value ||
                               profileName.value.trim() === '' || profileJabatan.value.trim() === ''

      if (!skipProfileCheck && profileIncomplete && !isRecentImport) {
        console.log('Showing profile setup modal - profile incomplete')
        showProfileSetupModal.value = true
      } else {
        console.log('Not showing profile setup modal')
        showProfileSetupModal.value = false
      }
    }
  }

  const saveData = () => {
    if (process.client) {
      const data = {
        profile: { name: profileName.value, jabatan: profileJabatan.value },
        attendances: attendances.value
      }
      localStorage.setItem('absensiApp_data', JSON.stringify(data))
    }
  }

  // Mark that import just happened and reload data
  const reloadDataAfterImport = () => {
    // Set flag that import just happened (expires in 10 seconds)
    const timestamp = Date.now().toString()
    localStorage.setItem('absensiApp_recentImport', timestamp)
    console.log('Setting recent import flag:', timestamp)

    // Force close profile modal if it's open
    showProfileSetupModal.value = false

    loadData(true) // Skip profile check

    console.log('After reloadDataAfterImport:', {
      profileName: profileName.value,
      profileJabatan: profileJabatan.value,
      modalOpen: showProfileSetupModal.value
    })
  }

  // Clear the recent import flag
  const clearRecentImportFlag = () => {
    localStorage.removeItem('absensiApp_recentImport')
  }

  // Force close profile modal (for emergency use)
  const forceCloseProfileModal = () => {
    showProfileSetupModal.value = false
    console.log('Profile modal force closed')
  }

  // --- CORE APP METHODS ---
  const saveProfile = () => {
    if (!profileName.value || !profileJabatan.value) {
      showMessage('Nama dan Jabatan harus diisi.', 'error')
      return
    }
    saveData()
    // Clear recent import flag when profile is manually saved
    clearRecentImportFlag()
    showMessage('Profil berhasil disimpan!', 'success')
    if (showProfileSetupModal.value) {
      showProfileSetupModal.value = false
    }
  }

  const saveAttendance = () => {
    const { date, checkIn, checkOut, notes } = currentAttendanceForm.value
    if (!checkIn) {
      showMessage('Waktu Check-in diperlukan.', 'error')
      return
    }
    const existingIndex = attendances.value.findIndex(att => att.date === date)
    const newEntry = { date, checkIn, checkOut, notes, name: profileName.value }
    if (existingIndex !== -1) {
      attendances.value[existingIndex] = newEntry
    } else {
      attendances.value.push(newEntry)
    }
    saveData()
    showMessage('Absensi berhasil disimpan!', 'success')
  }

  const quickCheckIn = () => {
    if (hasCheckedInTodayQuickAction.value) {
      showMessage('Anda sudah Check-in hari ini.', 'error')
      return
    }
    const currentTime = getCurrentTime()
    const existingIndex = attendances.value.findIndex(att => att.date === todayDateString)
    if (existingIndex !== -1) {
      attendances.value[existingIndex].checkIn = currentTime
    } else {
      attendances.value.push({
        date: todayDateString,
        checkIn: currentTime,
        checkOut: null,
        name: profileName.value,
        notes: ''
      })
    }
    if (selectedDate.value === todayDateString) {
      currentAttendanceForm.value.checkIn = currentTime
    }
    saveData()
    showMessage('Check-in berhasil!', 'success')
  }

  const quickCheckOut = () => {
    if (!hasCheckedInTodayQuickAction.value) {
      showMessage('Anda belum Check-in hari ini.', 'error')
      return
    }
    if (hasCheckedOutTodayQuickAction.value) {
      showMessage('Anda sudah Check-out hari ini.', 'error')
      return
    }
    const currentTime = getCurrentTime()
    const existingIndex = attendances.value.findIndex(att => att.date === todayDateString)
    if (existingIndex !== -1) {
      attendances.value[existingIndex].checkOut = currentTime
    }
    if (selectedDate.value === todayDateString) {
      currentAttendanceForm.value.checkOut = currentTime
    }
    saveData()
    showMessage('Check-out berhasil!', 'success')
  }

  // --- EDIT AND DELETE METHODS ---
  const openEditModal = (entry) => {
    originalEditEntryDate.value = entry.date
    editForm.value = { ...entry }
    showEditModal.value = true
  }

  const saveEditedAttendance = (updatedForm) => {
    if (!updatedForm.checkIn) {
      showMessage('Waktu Check-in diperlukan.', 'error')
      return
    }
    const indexToUpdate = attendances.value.findIndex(att => att.date === originalEditEntryDate.value)
    if (indexToUpdate !== -1) {
      attendances.value[indexToUpdate] = { ...updatedForm, name: profileName.value }
    }
    saveData()
    showEditModal.value = false
    showMessage('Absensi berhasil diperbarui!', 'success')
  }

  const cancelEditModal = () => {
    showEditModal.value = false
  }

  const openDeleteModal = (date) => {
    itemToDelete.value = date
    showDeleteConfirmModal.value = true
  }

  const deleteAttendance = () => {
    attendances.value = attendances.value.filter(att => att.date !== itemToDelete.value)
    saveData()
    showDeleteConfirmModal.value = false
    itemToDelete.value = null
    showMessage('Absensi berhasil dihapus.', 'success')
  }

  const cancelDeleteModal = () => {
    showDeleteConfirmModal.value = false
    itemToDelete.value = null
  }

  // --- SETTINGS METHODS ---
  const confirmResetApp = () => {
    showResetConfirmModal.value = true
  }

  // --- DATE NAVIGATION METHODS ---
  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth.value === 0) {
        selectedMonth.value = 11
        selectedYear.value--
      } else {
        selectedMonth.value--
      }
    } else if (direction === 'next') {
      if (selectedMonth.value === 11) {
        selectedMonth.value = 0
        selectedYear.value++
      } else {
        selectedMonth.value++
      }
    }
  }

  const resetApp = () => {
    try {
      if (process.client) {
        // Clear all localStorage data
        localStorage.removeItem('absensiApp_data')
        localStorage.removeItem('absensiApp_profile')
        localStorage.removeItem('absensiApp_settings')
        localStorage.removeItem('absensiApp_recentImport')

        // Reset all reactive state
        attendances.value = []
        profileName.value = ''
        profileJabatan.value = ''
        selectedDate.value = todayDateString
        currentAttendanceForm.value = {
          date: selectedDate.value,
          checkIn: null,
          checkOut: null,
          notes: ''
        }
        selectedMonth.value = today.getMonth()
        selectedYear.value = today.getFullYear()

        // Close modal
        showResetConfirmModal.value = false

        // Show success message
        showMessage('Aplikasi berhasil direset. Semua data telah dihapus.', 'success')

        // Reload page after a short delay to ensure clean state
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      }
    } catch (error) {
      console.error('Error resetting app:', error)
      showMessage('Terjadi kesalahan saat mereset aplikasi.', 'error')
    }
  }

  return {
    // State
    attendances,
    profileName,
    profileJabatan,
    selectedDate,
    currentAttendanceForm,
    selectedMonth,
    selectedYear,
    showProfileSetupModal,
    showEditModal,
    showDeleteConfirmModal,
    itemToDelete,
    showResetConfirmModal,
    message,
    messageType,
    messageFadingOut,
    editForm,
    originalEditEntryDate,

    // Computed
    isProfileComplete,
    months,
    years,
    todayAttendanceEntry,
    hasCheckedInTodayQuickAction,
    hasCheckedOutTodayQuickAction,
    monthlyAttendance,
    monthlyReport,
    summary,

    // Methods
    calculateDuration,
    getStatusClass,
    formatDate,
    getCurrentTime,
    showMessage,
    loadData,
    saveData,
    reloadDataAfterImport,
    clearRecentImportFlag,
    forceCloseProfileModal,
    saveProfile,
    saveAttendance,
    quickCheckIn,
    quickCheckOut,
    openEditModal,
    saveEditedAttendance,
    cancelEditModal,
    openDeleteModal,
    deleteAttendance,
    cancelDeleteModal,
    confirmResetApp,
    resetApp,
    navigateMonth
  }
}
