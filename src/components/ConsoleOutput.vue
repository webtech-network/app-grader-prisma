<template>
  <div class="console">
    <div class="console-header">
      <span>Console</span>
      <button class="btn btn-secondary" @click="$emit('clear')">Clear</button>
    </div>
    <div class="console-output">
      <div 
        v-for="(line, index) in output" 
        :key="index"
        class="output-line"
        :class="line.type"
      >
        {{ line.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  output: Array
})

defineEmits(['clear'])
</script>

<style scoped>
.console {
  height: 200px;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.console-header {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-tertiary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.console-header span {
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-secondary {
  padding: var(--spacing-xs) 0.75rem;
  background: var(--color-border);
  color: #ccc;
  font-size: 0.8rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #444;
}

.console-output {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.output-line {
  margin-bottom: var(--spacing-sm);
}

.output-success {
  color: var(--color-success);
}

.output-error {
  color: var(--color-error);
}

.output-info {
  color: var(--color-accent);
}
</style>
