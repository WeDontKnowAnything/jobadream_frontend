import { ref, watch } from 'vue'

let savedPostList = []

try {
  const saved = localStorage.getItem('postList')
  if (saved)
    savedPostList = JSON.parse(saved)
}
catch (error) {
  console.error('localStorage에서 postList를 파싱하는 중 오류 발생:', error)
  localStorage.removeItem('postList')
}

export const postList = ref(savedPostList)

watch(postList, newList => {
  localStorage.setItem('postList', JSON.stringify(newList))
}, { deep: true })
