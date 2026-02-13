<template>
  <div class="activity-list">
    <h2 class="section-title">Atividades</h2>
    <div class="activity-table">
      <div class="table-header">
        <div class="col-name">Nome</div>
        <div class="col-status">Status</div>
        <div class="col-grade">Nota</div>
        <div class="col-submission">Última Entrega</div>
      </div>
      <div class="table-body">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="activity-row"
          @click="handleActivityClick(activity.id)"
        >
          <div class="col-name">{{ activity.name }}</div>
          <div class="col-status">
            <span :class="['status-badge', getStatusClass(activity.status)]">
              {{ activity.status }}
            </span>
          </div>
          <div class="col-grade">{{ formatGrade(activity.grade) }}</div>
          <div class="col-submission">{{ formatDate(activity.lastSubmission) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatDate, formatGrade } from '../utils/formatters.js'

// Props
const props = defineProps({
  activities: {
    type: Array,
    required: true,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['select'])

// Methods
const handleActivityClick = (activityId) => {
  emit('select', activityId)
}

const getStatusClass = (status) => {
  const statusMap = {
    'Pendente': 'status-pending',
    'Em andamento': 'status-in-progress',
    'Concluída': 'status-completed'
  }
  return statusMap[status] || 'status-pending'
}
</script>

<style scoped>
.activity-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.activity-table {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 1.2fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.activity-row {
  display: grid;
  grid-template-columns: 2fr 1fr 0.8fr 1.2fr;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--color-text-secondary);
}

.activity-row:last-child {
  border-bottom: none;
}

.activity-row:hover {
  background: var(--color-bg-tertiary);
}

.col-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.col-status {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: rgba(240, 173, 78, 0.2);
  color: var(--color-warning);
}

.status-in-progress {
  background: rgba(74, 158, 255, 0.2);
  color: var(--color-accent);
}

.status-completed {
  background: rgba(92, 184, 92, 0.2);
  color: var(--color-success);
}

.col-grade,
.col-submission {
  display: flex;
  align-items: center;
}
</style>
