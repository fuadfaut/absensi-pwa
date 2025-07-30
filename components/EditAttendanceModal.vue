<template>
  <div class="modal-overlay">
    <div class="modal-content text-left">
      <div class="flex items-center mb-4">
        <IconLibrary name="edit" size="lg" class="mr-3 text-blue-600" />
        <h3 class="text-lg font-medium">Edit Absensi</h3>
      </div>
      <div class="mt-4 space-y-4">
        <div>
          <label for="editCheckInTime" class="block text-sm">Check-in</label>
          <input 
            type="time" 
            id="editCheckInTime" 
            v-model="localEditForm.checkIn" 
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label for="editCheckOutTime" class="block text-sm">Check-out</label>
          <input 
            type="time" 
            id="editCheckOutTime" 
            v-model="localEditForm.checkOut" 
            class="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label for="editNotes" class="block text-sm">Catatan</label>
          <textarea 
            id="editNotes" 
            v-model="localEditForm.notes" 
            rows="2" 
            class="w-full p-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <button
          @click="handleSave"
          class="btn-primary px-4 py-2 text-xs"
        >
          <IconLibrary name="save" size="xs" class="mr-1" />
          Simpan
        </button>
        <button
          @click="$emit('cancel')"
          class="btn-secondary px-4 py-2 text-xs"
        >
          <IconLibrary name="x" size="xs" class="mr-1" />
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import IconLibrary from './icons/IconLibrary.vue'

const props = defineProps({
  editForm: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

// Create a local copy of the edit form to avoid direct mutation
const localEditForm = ref({ ...props.editForm })

// Watch for changes in the prop and update local form
watch(() => props.editForm, (newForm) => {
  localEditForm.value = { ...newForm }
}, { deep: true })

const handleSave = () => {
  emit('save', localEditForm.value)
}
</script>
