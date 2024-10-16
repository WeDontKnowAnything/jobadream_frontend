<!-- components/posts-post-id.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { postList } from '../../components/posts/postList.js' // postList를 가져옵니다.

const route = useRoute()
const postId = route.params.id

const post = ref(null)

onMounted(() => {
  post.value = postList.value.find(p => p.post_id === Number(postId))
  if (!post.value) {
    alert('게시글을 찾을 수 없습니다.')

    // 필요시 목록 페이지로 이동
  }
  else {
    // 조회수 증가
    post.value.view_count += 1
  }
})
</script>

<template>
  <div>
    <h1>{{ post.title }}</h1>
    <p>작성자: {{ post.nickname }}</p>
    <p>날짜: {{ post.posting_date }}</p>
    <p>조회수: {{ post.view_count }}</p>
    <div>
      {{ post.content }}
    </div>
  </div>
</template>

<style scoped>
/* 필요한 스타일이 있다면 추가합니다 */
</style>
