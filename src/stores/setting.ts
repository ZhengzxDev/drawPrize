import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', () => {
  const groupCount = ref(3)
  const playerPerGroup = ref(2)
  const extraGroupName = ref('轮空组')
  const hasExtraGroup = ref(true)

  return { groupCount, playerPerGroup, extraGroupName, hasExtraGroup }
})
