import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { player } from '@/types/player'

export const useRuntimeStore = defineStore('runtime', () => {
  const selectSet: Set<player> = new Set()
  const getRandomSelect = (): player | null => {
    const arr = Array.from(selectSet)
    if (arr.length === 0) return null
    const index = Math.floor(Math.random() * arr.length)
    const p = arr[index]
    selectSet.delete(p)
    console.log('remove player', p)
    return p
  }
  const initSelectSetFromArray = (arr: player[]) => {
    selectSet.clear()
    console.log('set init', selectSet)
    arr.forEach((p) => selectSet.add(p))
  }

  const shuffling = ref(false)

  return {
    initSelectSetFromArray,
    selectSet,
    shuffling,
    getRandomSelect,
  }
})
