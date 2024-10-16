<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { postList } from '@/postList.js' // postList를 가져옵니다.

const router = useRouter()

const totalPost = computed(() => postList.length)

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref('post_id') // 기본 정렬 기준을 'post_id'로 설정
const orderBy = ref('desc') // 기본 정렬 순서를 내림차순으로 설정

// Data table Headers
const headers = [
  { title: '번호', key: 'post_id', sortable: true },
  { title: '제목', key: 'title', sortable: true },
  { title: '날짜', key: 'posting_date', sortable: true },
  { title: '조회수', key: 'view_count', sortable: true },
  { title: '액션', key: 'actions', sortable: false },
]

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0] || 'post_id'
  orderBy.value = options.sortDesc[0] ? 'desc' : 'asc'
}

// 필터링된 postList
// const filteredPosts = computed(() => {
//   if (!searchQuery.value)
//     return postList

//   return postList.filter(post =>
//     post.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
//   )
// })

// 정렬된 게시글 목록
// const sortedPosts = computed(() => {
//   console.log(filteredPosts)

//   const posts = [...filteredPosts]

//   if (sortBy.value) {
//     posts.sort((a, b) => {
//       const sortKey = sortBy.value
//       const order = orderBy.value === 'asc' ? 1 : -1
//       if (a[sortKey] < b[sortKey])
//         return -1 * order
//       if (a[sortKey] > b[sortKey])
//         return 1 * order

//       return 0
//     })
//   }
//   else {
//     posts.sort((a, b) => b.post_id - a.post_id)
//   }

//   return posts
// })

// 페이지네이션 적용된 게시글 목록
// const paginatedPosts = computed(() => {
//   const start = (page.value - 1) * itemsPerPage.value
//   const end = page.value * itemsPerPage.value

//   return sortedPosts.value.slice(start, end)
// })

// 비밀번호 확인 다이얼로그 관련 상태
const isDialogOpen = ref(false)
const inputPassword = ref('')
const selectedPost = ref(null)
const actionType = ref('') // 'edit' 또는 'delete'

const openEditDialog = (item: any) => {
  actionType.value = 'edit'
  selectedPost.value = item
  isDialogOpen.value = true
}

const openDeleteDialog = (item: any) => {
  actionType.value = 'delete'
  selectedPost.value = item
  isDialogOpen.value = true
}

const closeDialog = () => {
  isDialogOpen.value = false
  inputPassword.value = ''
  selectedPost.value = null
}

const hashPassword = async (password: string) => {
  const msgUint8 = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const confirmAction = async () => {
  if (!selectedPost.value) {
    alert('선택된 게시글이 없습니다.')

    return
  }

  const inputPasswordHash = await hashPassword(inputPassword.value)
  if (inputPasswordHash !== selectedPost.value.password) {
    alert('비밀번호가 일치하지 않습니다.')

    return
  }

  if (actionType.value === 'edit') {
    // 수정 페이지로 이동
    router.push({ name: 'posts-edit', params: { id: selectedPost.value.post_id } })
  }
  else if (actionType.value === 'delete') {
    // 게시글 삭제
    const index = postList.findIndex(post => post.post_id === selectedPost.value.post_id)
    if (index !== -1) {
      postList.splice(index, 1)
      alert('게시글이 삭제되었습니다.')
    }
  }

  closeDialog()
}
</script>

<template>
  <div>
    <VCard class="mb-6">
      <!-- 게시글 수 표시 -->
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            sm="6"
            md="3"
          >
            <div class="d-flex justify-space-between">
              <div class="d-flex flex-column gap-y-1">
                <h4 class="text-h4">
                  {{ totalPost }}
                </h4>
                <h6 class="text-h6">
                  작성된 게시글 수
                </h6>
              </div>
              <VAvatar
                variant="tonal"
                rounded
                size="38"
              >
                <VIcon
                  icon="tabler-clipboard-check"
                  size="28"
                />
              </VAvatar>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard>
      <!-- 필터 및 검색 -->
      <VCardText>
        <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4">
          <VTextField
            v-model="searchQuery"
            density="compact"
            placeholder="게시글 검색"
            style="max-inline-size: 400px; min-inline-size: 400px;"
          />
          <div class="d-flex gap-x-4 align-center">
            <!-- 페이지당 아이템 수 선택 -->
            <VSelect
              v-model="itemsPerPage"
              :items="[5, 10, 20, 50, 100]"
              label="페이지당 게시글 수"
              style="min-inline-size: 150px;"
            />
            <RouterLink :to="{ name: 'posts-add' }">
              <VBtn
                color="primary"
                prepend-icon="tabler-plus"
              >
                게시글 추가
              </VBtn>
            </RouterLink>
          </div>
        </div>
      </VCardText>
      <VDivider />

      <!-- 게시글 테이블 -->
      <!-- :items-length="filteredPosts.length" -->
      <VDataTable
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="paginatedPosts"
        :sort-by="sortBy"
        :sort-desc="orderBy === 'desc'"
        class="text-no-wrap fixed-width-table"
        @update:options="updateOptions"
      >
        <!-- 각 컬럼에 대한 템플릿 -->
        <template #item.post_id="{ item }">
          {{ item.post_id }}
        </template>

        <template #item.title="{ item }">
          <RouterLink
            :to="{ name: 'posts-post-id', params: { id: item.post_id } }"
            class="font-weight-medium"
          >
            {{ item.title }}
          </RouterLink>
        </template>

        <template #item.posting_date="{ item }">
          {{ item.posting_date }}
        </template>

        <template #item.view_count="{ item }">
          {{ item.view_count }}
        </template>

        <template #item.actions="{ item }">
          <VBtn
            icon
            @click="openEditDialog(item)"
          >
            <VIcon>mdi-pencil</VIcon>
          </VBtn>
          <VBtn
            icon
            @click="openDeleteDialog(item)"
          >
            <VIcon>mdi-delete</VIcon>
          </VBtn>
        </template>

        <!-- 페이지네이션 -->
        <template #bottom>
          <VDivider />
          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              총 {{ filteredPosts.length }}개의 게시글 중
              {{ (page - 1) * itemsPerPage + 1 }}-
              {{ Math.min(page * itemsPerPage, filteredPosts.length) }}번째 게시글
            </p>
            <VPagination
              v-model="page"
              :length="Math.ceil(filteredPosts.length / itemsPerPage)"
              :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(filteredPosts.length / itemsPerPage), 5)"
            >
              <template #prev="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  이전
                </VBtn>
              </template>

              <template #next="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  다음
                </VBtn>
              </template>
            </VPagination>
          </div>
        </template>
      </VDataTable>
    </VCard>

    <!-- 비밀번호 입력 다이얼로그 -->
    <VDialog v-model="isDialogOpen">
      <VCard>
        <VCardTitle>비밀번호 확인</VCardTitle>
        <VCardText>
          <VTextField
            v-model="inputPassword"
            label="비밀번호"
            type="password"
            maxlength="6"
            required
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="closeDialog"
          >
            취소
          </VBtn>
          <VBtn
            text
            @click="confirmAction"
          >
            확인
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style lang="scss" scoped>
.fixed-width-table {
  inline-size: 100%;
  table-layout: fixed;
}

.fixed-width-table th,
.fixed-width-table td {
  overflow: hidden;
  inline-size: 20%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
