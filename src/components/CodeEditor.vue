<template>
  <div id="editor" ref="editorContainer"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { loadMonaco } from '../utils/monaco-loader'

const props = defineProps({
  modelValue: String,
  language: String
})

const emit = defineEmits(['update:modelValue'])

const editorContainer = ref(null)
let editor = null

onMounted(async () => {
  const monaco = await loadMonaco()
  
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  })
  
  editor.onDidChangeModelContent(() => {
    emit('update:modelValue', editor.getValue())
  })
})

watch(() => props.language, (newLang) => {
  if (editor) {
    const monaco = window.monaco
    monaco.editor.setModelLanguage(editor.getModel(), newLang)
  }
})

watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})
</script>

<style scoped>
#editor {
  flex: 1;
  overflow: hidden;
}
</style>
