<template>
  <div class="dashboard">
    <h2 class="section-title">Desempenho</h2>
    <div class="stats-container">
      <div class="stat-card">
        <h3 class="stat-label">Atividades Entregues</h3>
        <div class="stat-value">{{ stats.submittedCount }}</div>
      </div>
      <div class="stat-card">
        <h3 class="stat-label">Média de Pontos</h3>
        <div class="stat-value">{{ formattedAverageScore }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

// Props
const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      submittedCount: 0,
      averageScore: null
    })
  }
})

// Computed
const formattedAverageScore = computed(() => {
  if (props.stats.averageScore === null || props.stats.averageScore === undefined) {
    return '—'
  }
  return props.stats.averageScore.toFixed(1)
})
</script>

<style scoped>
.dashboard {
  width: 320px;
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

.stats-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stat-card {
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}
</style>
