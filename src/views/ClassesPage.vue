<template>
  <div class="classes-page">
    <h1 class="page-title">Minhas Turmas</h1>
    <div class="classes-grid">
      <div
        v-for="classItem in classes"
        :key="classItem.id"
        class="class-card"
        @click="navigateToClass(classItem.id)"
      >
        <h2 class="class-name">{{ classItem.name }}</h2>
        <p class="class-description">{{ classItem.description }}</p>
        <div class="class-stats">
          <span class="stat-item">
            {{ getActivityCount(classItem.id) }} atividades
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { mockClasses, mockActivities } from '../data/studentData.js'

const router = useRouter()
const classes = mockClasses

const getActivityCount = (classId) => {
  return mockActivities.filter(activity => activity.classId === classId).length
}

const navigateToClass = (classId) => {
  router.push(`/class/${classId}/activities`)
}
</script>

<style scoped>
.classes-page {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xl);
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.class-card {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-xl);
  cursor: pointer;
  transition: all 0.2s ease;
}

.class-card:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
  transform: translateY(-4px);
}

.class-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.class-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.5;
}

.class-stats {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.stat-item {
  font-size: 0.875rem;
  color: var(--color-accent);
  font-weight: 500;
}
</style>
