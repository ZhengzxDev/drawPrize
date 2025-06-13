import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { player } from '@/types/player'

export const usePlayerStore = defineStore('player', () => {
  const players = ref<Array<player>>([])

  return { players }
})
