import type { RouteRecordRaw } from 'vue-router/auto'
import Posts from '../../views/BoardView.vue'
import PostsAdd from '../../views/post/posts-add.vue'
import PostsEdit from '../../views/post/posts-edit.vue'
import PostsPostId from '../../views/post/posts-post-id.vue'

// 👉 Redirects
export const redirects: RouteRecordRaw[] = [
  // 기존 내용은 그대로 유지합니다.
  {
    path: '/',
    name: 'index',
    redirect: () => {
      return { name: 'home' }
    },
  },

  // 필요에 따라 다른 리다이렉트도 유지합니다.
]

// 👉 Routes
export const routes: RouteRecordRaw[] = [
  {
    path: '/posts',
    name: 'posts',
    component: Posts,
  },
  {
    path: '/posts/add',
    name: 'posts-add',
    component: PostsAdd,
  },
  {
    path: '/posts/edit/:id',
    name: 'posts-edit',
    component: PostsEdit,
    props: true,
  },
  {
    path: '/posts/:id',
    name: 'posts-post-id',
    component: PostsPostId,
    props: true,
  },
]
