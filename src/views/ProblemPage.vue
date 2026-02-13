<template>
  <div class="main-content">
    <ProblemPanel />
    <EditorPanel 
      v-model:code="code"
      v-model:language="language"
      :output="output"
      @run="runCode"
      @submit="submitCode"
      @clear-output="clearOutput"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProblemPanel from '../components/ProblemPanel.vue'
import EditorPanel from '../components/EditorPanel.vue'
import { codeTemplates, testCases } from '../data/problems'

const route = useRoute()
// Get activity ID from route params
const activityId = route.params.id
// For now, we'll use the existing Two Sum problem regardless of activity ID
// Future enhancement: load problem data based on activityId

const language = ref('javascript')
const code = ref(codeTemplates.javascript)
const output = ref([])

watch(language, (newLang) => {
  code.value = codeTemplates[newLang]
})

const addOutput = (text, type = '') => {
  output.value.push({ text, type })
}

const clearOutput = () => {
  output.value = []
}

const runCode = () => {
  clearOutput()
  addOutput('Running test case 1...', 'output-info')
  
  if (language.value === 'javascript') {
    try {
      eval(code.value)
      const result = twoSum(testCases[0].input.nums, testCases[0].input.target)
      
      addOutput(`Input: nums = [${testCases[0].input.nums}], target = ${testCases[0].input.target}`)
      addOutput(`Output: [${result}]`)
      addOutput(`Expected: [${testCases[0].expected}]`)
      
      if (JSON.stringify(result.sort()) === JSON.stringify(testCases[0].expected.sort())) {
        addOutput('✓ Test passed!', 'output-success')
      } else {
        addOutput('✗ Test failed!', 'output-error')
      }
    } catch (error) {
      addOutput(`Error: ${error.message}`, 'output-error')
    }
  } else {
    addOutput('Only JavaScript execution is supported in this demo.', 'output-info')
  }
}

const submitCode = () => {
  clearOutput()
  addOutput('Running all test cases...', 'output-info')
  
  if (language.value === 'javascript') {
    try {
      eval(code.value)
      let passed = 0
      
      testCases.forEach((test, index) => {
        const result = twoSum(test.input.nums, test.input.target)
        const success = JSON.stringify(result.sort()) === JSON.stringify(test.expected.sort())
        
        addOutput(
          `Test ${index + 1}: ${success ? '✓ Passed' : '✗ Failed'}`,
          success ? 'output-success' : 'output-error'
        )
        
        if (success) passed++
      })
      
      addOutput('━━━━━━━━━━━━━━━━━━━━', 'output-info')
      addOutput(
        `${passed}/${testCases.length} test cases passed`,
        passed === testCases.length ? 'output-success' : 'output-error'
      )
      
      if (passed === testCases.length) {
        addOutput('🎉 All tests passed! Submission accepted.', 'output-success')
      }
    } catch (error) {
      addOutput(`Error: ${error.message}`, 'output-error')
    }
  } else {
    addOutput('Only JavaScript execution is supported in this demo.', 'output-info')
  }
}
</script>

<style scoped>
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
