<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { VCardText } from 'vuetify/lib/components/index.mjs'
import { useJobStore } from '@/stores/jobStore'

const jobStore = useJobStore()
const { jobList } = storeToRefs(jobStore)

const regionCheckboxContent = [
  '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '경남', '경북', '전남', '전북', '충남', '충북', '제주',
]

const positionCheckboxContent = [
  '기획·전략', '마케팅·홍보·조사', '회계·세무·재무', '인사·노무·HRD', '총무·법무·사무', 'IT개발·데이터', '디자인', '영업·판매·무역', '고객상담·TM', '구매·자재·물류', '상품기획·MD', '운전·운송·배송', '서비스', '생산', '건설·건축', '의료', '연구·R&D', '교육', '미디어·문화·스포츠', '금융·보험', '공공·복지',
]

const numberedSteps = [
  {
    title: '지역 선택',
    subtitle: '찾고 싶은 지역을 선택하세요.',
  },
  {
    title: '포지션 선택',
    subtitle: '원하는 포지션을 선택하세요.',
  },
  {
    title: '키워드 입력',
    subtitle: '해당되는 키워드를 입력하세요.',
  },
]

const currentStep = ref(0)

const formData = ref({
  location: [],
  position: [],
  keyword: '',
})

// Data table options
const itemsPerPage = ref(12)
const page = ref(1)

const paginatedData = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value

  return jobList.value.slice(start, end)
})

const onSearchJob = () => {
  jobStore.getSearchJob(formData.value.location, formData.value.position, formData.value.keyword)
}

const totalJobs = computed(() => jobList.value.length)

onMounted(() => {
  jobStore.getJobList()
})

// 더미 데이터 예시
const jobCategories = ref({
  preparing: [
    { date: '2024-10-10', title: '백엔드 개발자 채용' },
    { date: '2024-10-15', title: '프론트엔드 개발자 채용' },
  ],
  inProgress: [
    { date: '2024-10-05', title: '디자이너 채용' },
    { date: '2024-10-07', title: '마케팅 매니저 채용' },
  ],
  closingSoon: [
    { date: '2024-10-09', title: '회계팀 사원 채용' },
    { date: '2024-10-08', title: 'HR 매니저 채용' },
  ],
})
</script>

<template>
  <div>
    <!-- 검색 -->
    <VCard class="mb-6">
      <VRow>
        <VCol
          cols="12"
          md="3"
          :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'"
        >
          <VCardText>
            <!-- 👉 Stepper -->
            <AppStepper
              v-model:current-step="currentStep"
              direction="vertical"
              :items="numberedSteps"
            />
          </VCardText>
        </VCol>
        <!-- 👉 stepper content -->
        <VCol
          cols="12"

          md="9"
        >
          <VCardText>
            <VForm>
              <VWindow
                v-model="currentStep"
                class="disable-tab-transition"
              >
                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h5 class="text-h5 font-weight-medium">
                        {{ numberedSteps[currentStep].title }}
                      </h5>
                      <p class="mb-0">
                        {{ numberedSteps[currentStep].subtitle }} (미지정 : 전국)
                      </p>
                    </VCol>
                    <VCol cols="12">
                      <JadCheckboxes
                        v-model:selected-checkbox="formData.location"
                        :checkbox-content="regionCheckboxContent"
                        :grid-column="{ sm: '3', lg: '2', cols: '4' }"
                      />
                    </VCol>
                  </VRow>
                </VWindowItem>

                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h5 class="text-h5 font-weight-medium">
                        {{ numberedSteps[currentStep].title }}
                      </h5>
                      <p class="mb-0">
                        {{ numberedSteps[currentStep].subtitle }} (미지정 : 전체)
                      </p>
                    </VCol>

                    <VCol cols="12">
                      <JadCheckboxes
                        v-model:selected-checkbox="formData.position"
                        :checkbox-content="positionCheckboxContent"
                        :grid-column="{ sm: '4', lg: '3', cols: '6' }"
                      />
                    </VCol>
                  </VRow>
                </VWindowItem>

                <VWindowItem>
                  <VRow>
                    <VCol cols="12">
                      <h5 class="text-h5 font-weight-medium">
                        {{ numberedSteps[currentStep].title }}
                      </h5>
                      <p class="mb-0">
                        {{ numberedSteps[currentStep].subtitle }}
                      </p>
                    </VCol>

                    <VCol cols="12">
                      <AppTextField
                        v-model="formData.keyword"
                        placeholder="키워드 입력"
                        label="키워드"
                      />
                    </VCol>
                  </VRow>
                </VWindowItem>
              </VWindow>

              <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                <VBtn
                  color="secondary"
                  variant="tonal"
                  :disabled="currentStep === 0"
                  @click="currentStep--"
                >
                  <VIcon
                    icon="tabler-arrow-left"
                    start
                    class="flip-in-rtl"
                  />
                  이전
                </VBtn>

                <VBtn
                  v-if="numberedSteps.length - 1 === currentStep"
                  color="success"
                  @click="onSearchJob"
                >
                  검색
                </VBtn>

                <VBtn
                  v-else
                  @click="currentStep++"
                >
                  다음
                  <VIcon
                    icon="tabler-arrow-right"
                    end
                    class="flip-in-rtl"
                  />
                </VBtn>
              </div>
            </VForm>
          </VCardText>
        </VCol>
      </VRow>
    </VCard>

    <!-- 기업 정보 카테고리별 표시 -->
    <VCard class="mb-6">
      <VCardTitle>
        기업 정보
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="4"
          >
            <VCard outlined>
              <VCardTitle>채용 예정</VCardTitle>
              <VCardText>
                <ul>
                  <li
                    v-for="(job, index) in jobCategories.preparing"
                    :key="index"
                  >
                    {{ job.date }} - {{ job.title }}
                  </li>
                </ul>
              </VCardText>
            </VCard>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCard outlined>
              <VCardTitle>채용 중</VCardTitle>
              <VCardText>
                <ul>
                  <li
                    v-for="(job, index) in jobCategories.inProgress"
                    :key="index"
                  >
                    {{ job.date }} - {{ job.title }}
                  </li>
                </ul>
              </VCardText>
            </VCard>
          </VCol>

          <VCol
            cols="12"
            md="4"
          >
            <VCard outlined>
              <VCardTitle>마감 직전</VCardTitle>
              <VCardText>
                <ul>
                  <li
                    v-for="(job, index) in jobCategories.closingSoon"
                    :key="index"
                  >
                    {{ job.date }} - {{ job.title }}
                  </li>
                </ul>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- 채용공고 카드 -->
    <VRow>
      <VCol
        v-for="data in paginatedData"
        :key="data.title"
        cols="12"
        md="6"
        lg="4"
      >
        <VCard>
          <VCardItem>
            <VCardTitle class="text-white">
              <RouterLink
                :to="{ name: 'job-id', params: { id: data.id } }"
                class="font-weight-medium"
              >
                {{ data.corp_name }}
              </RouterLink>
            </VCardTitle>
          </VCardItem>

          <VCardText>
            <p class="clamp-text text-white mb-0">
              {{ data.title }}
            </p>
          </VCardText>

          <VCardText class="d-flex justify-space-between align-center flex-wrap">
            <div class="d-flex align-center gap-4">
              <span>
                <IconBtn
                  icon="tabler-map-2"
                  color="white"
                  class="me-1"
                />
                <span class="text-subtitle-2 text-white mt-1">{{ data.location }}</span>
              </span>
              <span>
                <IconBtn
                  icon="tabler-layout-align-bottom"
                  color="white"
                  class="me-1"
                />
                <span class="text-subtitle-2 text-white mt-1">{{ data.position }}</span>
              </span>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
      <p class="text-sm text-disabled mb-0">
        {{ paginationMeta({ page, itemsPerPage }, totalJobs) }}
      </p>

      <VPagination
        v-model="page"
        :length="Math.ceil(totalJobs / itemsPerPage)"
        :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalJobs / itemsPerPage), 5)"
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
  </div>
</template>
