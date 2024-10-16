<!-- components/posts-edit.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postList } from '../../components/posts/postList.js' // postList를 가져옵니다.

const route = useRoute()
const router = useRouter()
const postId = route.params.id

const title = ref('')
const content = ref('')
const post = ref(null)

onMounted(() => {
  post.value = postList.value.find(p => p.post_id === Number(postId))
  if (post.value) {
    title.value = post.value.title
    content.value = post.value.content
  }
  else {
    alert('게시글을 찾을 수 없습니다.')
    router.push({ name: 'posts' })
  }
})

const submitEdit = () => {
  if (post.value) {
    post.value.title = title.value
    post.value.content = content.value
    alert('게시글이 수정되었습니다.')
    router.push({ name: 'posts-post-id', params: { id: postId } })
  }
}
</script>

<template>
  <div>
    <VForm @submit.prevent="submitEdit">
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
      <VBtn
        type="submit"
        color="primary"
      >
        수정 완료
      </VBtn>
    </VForm>
  </div>
</template>

<style scoped>
/* 필요한 스타일이 있다면 추가합니다 */
</style>
