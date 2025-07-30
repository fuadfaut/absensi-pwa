<template>
  <!-- Message Box Overlay -->
  <div
    class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-150"
    :class="{ 'opacity-0': fadingOut }"
  >
    <div
      :class="[
        'message-box',
        type,
        { 'fade-out': fadingOut }
      ]"
    >
      {{ message }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['success', 'error'].includes(value)
  },
  fadingOut: {
    type: Boolean,
    default: false
  }
})
</script>
