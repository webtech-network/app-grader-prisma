<template>
  <div class="activities-page">
    <div class="page-header">
      <button class="back-button" @click="goBack">
        ← Voltar para Turmas
      </button>
      <h1 class="page-title">{{ currentClass?.name }}</h1>
      <p class="class-description">{{ currentClass?.description }}</p>
    </div>

    <div class="main-section">
      <ActivityList :activities="filteredActivities" @select="navigateToActivity" />
      <Dashboard :stats="stats" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ActivityList from '../components/ActivityList.vue'
import Dashboard from '../components/Dashboard.vue'
import { mockActivities, mockClasses } from '../data/studentData.js'

const router = useRouter()
const route = useRoute()

// Get current class ID from route
const classId = route.params.classId

// Find current class
const currentClass = computed(() => {
  return mockClasses.find(c => c.id === classId)
})

// Filter activities by class
const filteredActivities = computed(() => {
  return mockActivities.filter(activity => activity.classId === classId)
})

// Calculate stats for filtered activities
const stats = computed(() => {
  const activities = filteredActivities.value
  
  const submittedCount = activities.filter(activity => activity.lastSubmission !== null).length
  
  const gradedActivities = activities.filter(activity => activity.grade !== null)
  const averageScore = gradedActivities.length > 0
    ? gradedActivities.reduce((sum, activity) => sum + activity.grade, 0) / gradedActivities.length
    : null
  
  return {
    submittedCount,
    averageScore
  }
})

const navigateToActivity = (id) => {
  router.push(`/problem/${id}`)
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.activities-page {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.back-button {
  align-self: flex-start;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: var(--color-bg-tertiary);
  border-color: var(--color-accent);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.class-description {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin: 0;
}

.main-section {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}
</style>
