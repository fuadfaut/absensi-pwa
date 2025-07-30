<template>
  <div class="mt-4">
    <!-- Format Info -->
    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-medium text-blue-800 mb-2">Format File Import:</h4>
      <div class="text-sm text-blue-700">
        <p class="mb-1">File harus berformat .txt dengan struktur:</p>
        <pre class="bg-blue-100 p-2 rounded text-xs">1 Januari
CI : 08:00
CO : 17:00
Catatan : Keterangan (opsional)
---
2 Januari
CI : 08:15
CO : -</pre>
        <p class="mt-2 text-xs">
          <strong>Penting:</strong> Data akan diimpor untuk tahun <strong>{{ selectedYear }}</strong>.
          Gunakan "---" untuk memisahkan setiap entri. CO bisa diisi "-" jika tidak ada check out.
        </p>
      </div>
    </div>

    <div class="flex gap-2 mb-4">
    <button
      @click="exportHistoryData"
      class="w-full inline-flex items-center justify-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      Ekspor Riwayat
    </button>
    <label class="w-full text-center inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer transition-colors">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
      </svg>
      Impor Riwayat
      <input
        type="file"
        @change="importHistoryData"
        class="hidden"
        accept=".txt"
      />
    </label>
    </div>
  </div>
</template>

<script setup>
import { nextTick } from 'vue'
import { useAttendance } from '~/composables/useAttendance'

const props = defineProps({
  monthlyAttendance: {
    type: Array,
    required: true
  },
  selectedMonth: {
    type: Number,
    required: true
  },
  selectedYear: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['show-message', 'data-imported'])

const monthNamesId = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const exportHistoryData = () => {
  if (props.monthlyAttendance.length === 0) {
    emit('show-message', 'Tidak ada data riwayat untuk diekspor di bulan ini.', 'error')
    return
  }
  
  let exportContent = ''
  props.monthlyAttendance.forEach((entry, index) => {
    const date = new Date(entry.date + 'T00:00:00')
    const formattedDate = `${date.getDate()} ${monthNamesId[date.getMonth()]}`
    exportContent += `${formattedDate}\n`

    // Ensure consistent time format (HH:MM) in export
    const formatTime = (timeStr) => {
      if (!timeStr) return '-'
      // If already in HH:MM format, return as is
      if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr
      // If in H:MM or H:M format, normalize it
      const parts = timeStr.split(':')
      if (parts.length === 2) {
        const hours = parseInt(parts[0]).toString().padStart(2, '0')
        const minutes = parseInt(parts[1]).toString().padStart(2, '0')
        return `${hours}:${minutes}`
      }
      return timeStr
    }

    exportContent += `CI : ${formatTime(entry.checkIn)}\n`
    exportContent += `CO : ${formatTime(entry.checkOut)}\n`
    if (entry.notes) {
      exportContent += `Catatan : ${entry.notes}\n`
    }
    if (index < props.monthlyAttendance.length - 1) {
      exportContent += `---\n`
    }
  })

  const monthName = monthNamesId[props.selectedMonth]
  const fileName = `riwayat_absensi_${monthName}_${props.selectedYear}.txt`
  
  const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  emit('show-message', 'Riwayat berhasil diekspor!', 'success')
}

const importHistoryData = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const fileContent = e.target.result.trim()
      console.log('Starting import process...')

      // Split by --- and clean up blocks
      let blocks = []
      if (fileContent.includes('---')) {
        blocks = fileContent.split('---').map(block => block.trim()).filter(block => block !== '')
      } else {
        // Single entry without separator
        blocks = [fileContent.trim()]
      }

      console.log('Found', blocks.length, 'entries to import')

      let importedCount = 0
      let errorCount = 0

      const { attendances, profileName, saveData, loadData } = useAttendance()
      console.log('Starting import process. Current attendances:', attendances.value.length)

      blocks.forEach((block) => {
        const lines = block.split('\n').map(line => line.trim()).filter(line => line !== '')

        if (lines.length === 0) {
          return
        }

        const dateLine = lines[0]
        const ciLine = lines.find(line => line.startsWith('CI :') || line.startsWith('CI:'))
        const coLine = lines.find(line => line.startsWith('CO :') || line.startsWith('CO:'))
        const notesLine = lines.find(line => line.startsWith('Catatan :') || line.startsWith('Catatan:'))

        if (!dateLine || !ciLine) {
          console.log('Skipping invalid entry - missing date or check-in time')
          errorCount++
          return
        }

        const dateParts = dateLine.split(' ')
        if (dateParts.length < 2) {
          console.log('Invalid date format:', dateLine, 'parts:', dateParts)
          errorCount++
          return
        }
        const day = parseInt(dateParts[0])
        const monthName = dateParts[1]
        const monthIndex = monthNamesId.findIndex(name => name.toLowerCase() === monthName.toLowerCase())



        if (isNaN(day) || monthIndex === -1) {
          console.log('Invalid day or month:', { day, monthName, monthIndex, dateParts })
          errorCount++
          return
        }

        // Assume the imported year is the currently selected year in the history tab
        const dateObj = new Date(props.selectedYear, monthIndex, day)
        const formattedDate = dateObj.toISOString().split('T')[0]

        // Extract time values - handle both "CI : 08:00" and "CI: 08:00" formats
        const extractTime = (line) => {
          if (!line) return null

          // Handle "CI : 08:00" or "CI: 08:00" format
          let timeStr = ''
          if (line.includes(' : ')) {
            timeStr = line.split(' : ')[1]?.trim()
          } else if (line.includes(': ')) {
            timeStr = line.split(': ')[1]?.trim()
          } else if (line.includes(':')) {
            const parts = line.split(':')
            if (parts.length >= 2) {
              timeStr = parts.slice(1).join(':').trim()
            }
          }

          return timeStr || null
        }

        const checkIn = extractTime(ciLine)
        const checkOut = extractTime(coLine)
        const notes = notesLine ? (
          notesLine.includes(' : ') ?
            notesLine.split(' : ')[1]?.trim() :
            notesLine.split(': ')[1]?.trim() || notesLine.substring('Catatan'.length).trim()
        ) : ''



        // Helper function to normalize time format
        const normalizeTime = (timeStr) => {
          if (!timeStr || timeStr === '-') return null

          // Handle various time formats: "8:00", "08:00", "8:0", etc.
          const timeParts = timeStr.split(':')
          if (timeParts.length !== 2) return null

          const hours = parseInt(timeParts[0])
          const minutes = parseInt(timeParts[1])

          if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            return null
          }

          // Return normalized format HH:MM
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        }

        // Normalize and validate times
        const normalizedCheckIn = normalizeTime(checkIn)
        const normalizedCheckOut = normalizeTime(checkOut)



        // CheckIn is required (unless it's explicitly "-")
        if (!normalizedCheckIn && checkIn !== '-') {
          console.log('Invalid checkIn format:', checkIn, 'normalized:', normalizedCheckIn)
          errorCount++
          return
        }

        const newEntry = {
          date: formattedDate,
          checkIn: normalizedCheckIn,
          checkOut: normalizedCheckOut,
          notes: notes,
          name: profileName.value // Assign current profile name to imported entries
        }

        const existingIndex = attendances.value.findIndex(att => att.date === newEntry.date)
        if (existingIndex !== -1) {
          // Overwrite existing entry for the same date
          attendances.value[existingIndex] = newEntry
        } else {
          attendances.value.push(newEntry)
        }

        importedCount++
      })

      console.log('Import completed:', importedCount, 'imported,', errorCount, 'errors')

      // Save data and force reload to ensure reactivity
      saveData()

      // Force reactivity update by triggering a re-render
      nextTick(() => {
        loadData()
        // Emit event to parent to refresh data
        emit('data-imported', importedCount)
      })

      if (importedCount > 0) {
        emit('show-message', `Berhasil mengimpor ${importedCount} entri riwayat! Data akan muncul sesuai bulan/tahun yang dipilih.`, 'success')
      }
      if (errorCount > 0) {
        emit('show-message', `Ada ${errorCount} entri yang gagal diimpor. Periksa console browser (F12) untuk detail error. Pastikan format file sesuai dengan contoh.`, 'error')
      }
      if (importedCount === 0 && errorCount === 0) {
        emit('show-message', 'Tidak ada entri riwayat yang valid ditemukan untuk diimpor.', 'error')
      }
    } catch (error) {
      emit('show-message', 'Gagal membaca file riwayat. Pastikan formatnya benar.', 'error')
      console.error('Error importing history data:', error)
    }
  }
  reader.readAsText(file)
  event.target.value = '' // Clear the file input
}
</script>
