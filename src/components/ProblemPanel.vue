<template>
  <div class="problem-panel">
    <div class="tabs">
      <button 
        class="tab" 
        :class="{ active: activeTab === 'description' }"
        @click="activeTab = 'description'"
      >
        Description
      </button>
      <button 
        class="tab" 
        :class="{ active: activeTab === 'solution' }"
        @click="activeTab = 'solution'"
      >
        Solution
      </button>
    </div>
    
    <div v-show="activeTab === 'description'" class="tab-content">
      <h2>Two Sum</h2>
      <div class="difficulty easy">Easy</div>
      
      <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
      
      <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
      
      <h3>Example 1:</h3>
      <pre>Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
      
      <h3>Example 2:</h3>
      <pre>Input: nums = [3,2,4], target = 6
Output: [1,2]</pre>
      
      <h3>Constraints:</h3>
      <ul>
        <li>2 ≤ nums.length ≤ 10⁴</li>
        <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
        <li>-10⁹ ≤ target ≤ 10⁹</li>
      </ul>
    </div>
    
    <div v-show="activeTab === 'solution'" class="tab-content">
      <h2>Solution Approach</h2>
      <p>Use a hash map to store numbers and their indices as you iterate through the array. For each number, check if the complement (target - current number) exists in the map.</p>
      <p><strong>Time Complexity:</strong> O(n)</p>
      <p><strong>Space Complexity:</strong> O(n)</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('description')
</script>

<style scoped>
.problem-panel {
  width: 40%;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
}

.tab {
  padding: 0.75rem var(--spacing-lg);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--color-text-primary);
}

.tab.active {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-accent);
}

.tab-content {
  padding: var(--spacing-xl);
  overflow-y: auto;
  flex: 1;
}

.tab-content h2 {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.tab-content h3 {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  color: #ccc;
  font-size: 1rem;
}

.difficulty {
  display: inline-block;
  padding: var(--spacing-xs) 0.75rem;
  border-radius: var(--radius-lg);
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.difficulty.easy {
  background: #1a472a;
  color: var(--color-success);
}

.tab-content p {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
  color: #ccc;
}

.tab-content code {
  background: #2a2a2a;
  padding: 0.2rem 0.4rem;
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  font-family: 'Courier New', monospace;
}

.tab-content pre {
  background: #2a2a2a;
  padding: var(--spacing-md);
  border-radius: 5px;
  overflow-x: auto;
  margin: var(--spacing-sm) 0;
  border-left: 3px solid var(--color-accent);
}

.tab-content ul {
  margin-left: var(--spacing-lg);
  color: #ccc;
}

.tab-content li {
  margin-bottom: var(--spacing-sm);
}
</style>
