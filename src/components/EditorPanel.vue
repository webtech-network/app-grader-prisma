<template>
  <div class="editor-panel">
    <div class="editor-header">
      <select 
        class="select" 
        :value="language"
        @change="$emit('update:language', $event.target.value)"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <button class="btn btn-primary" @click="$emit('run')">▶ Run Code</button>
      <button class="btn btn-success" @click="$emit('submit')">✓ Submit</button>
    </div>
    
    <CodeEditor 
      :modelValue="code" 
      :language="language"
      @update:modelValue="$emit('update:code', $event)"
    />
    
    <ConsoleOutput 
      :output="output"
      @clear="$emit('clearOutput')"
    />
  </div>
</template>

<script setup>
import CodeEditor from './CodeEditor.vue'
import ConsoleOutput from './ConsoleOutput.vue'

defineProps({
  code: String,
  language: String,
  output: Array
})

defineEmits(['update:code', 'update:language', 'run', 'submit', 'clearOutput'])
</script>

<style scoped>
.editor-panel {
  width: 60%;
  display: flex;
  flex-direction: column;
}

.editor-header {
  background: var(--color-bg-tertiary);
  padding: 0.75rem var(--spacing-md);
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  border-bottom: 1px solid var(--color-border);
}

.select {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-secondary);
  border: 1px solid #444;
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-text-primary);
}

.btn-primary:hover {
  background: #3a8eef;
}

.btn-success {
  background: var(--color-success);
  color: var(--color-text-primary);
}

.btn-success:hover {
  background: #4ca84c;
}
</style>
