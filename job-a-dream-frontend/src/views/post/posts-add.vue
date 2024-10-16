<!-- components/posts-add.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { postList } from '../../postList.js' // postList를 가져옵니다.

const title = ref('')
const content = ref('')
const nickname = ref('')
const password = ref('')

const router = useRouter()

const hashPassword = async password => {
  const msgUint8 = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const submitPost = async () => {
  if (password.value.length !== 6) {
    alert('비밀번호는 6자리여야 합니다.')

    return
  }

  const passwordHash = await hashPassword(password.value)

  // 새로운 게시글 객체 생성
  const newPost = {
    post_id: Date.now(), // 임시로 현재 시간을 ID로 사용
    title: title.value,
    content: content.value,
    nickname: nickname.value,
    password: passwordHash, // 해시화된 비밀번호 저장
    posting_date: new Date().toLocaleDateString(),
    view_count: 0,
  }

  // 게시글 목록에 추가
  postList.value.push(newPost)

  console.log('새로운 게시글이 추가되었습니다:', newpost)
  console.log('현재 postlist:', postList.value)

  alert('게시글이 생성되었습니다.')
  router.push({ name: 'posts' })
}
</script>

<template>
  <div>
    <VForm @submit.prevent="submitPost">
      <VTextField
        v-model="title"
        label="제목"
        required
      />
      <VTextarea
        v-model="content"
        label="내용"
        required
      />
      <VTextField
        v-model="nickname"
        label="닉네임"
        required
      />
      <VTextField
        v-model="password"
        label="비밀번호 (6자리)"
        type="password"
        maxlength="6"
        required
      />
      <VBtn
        type="submit"
        color="primary"
      >
        게시글 작성
      </VBtn>
    </VForm>
  </div>
</template>

<style scoped>
/* 필요한 스타일이 있다면 추가합니다 */
</style>
