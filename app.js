const { createApp, ref, computed, onMounted, watch } = Vue;

// Design System Components
const AppHeader = {
    template: `
        <header>
            <h1>🎯 Prisma</h1>
        </header>
    `
};

const TabButton = {
    props: ['active', 'label'],
    emits: ['click'],
    template: `
        <button 
            class="tab" 
            :class="{ active }"
            @click="$emit('click')"
        >
            {{ label }}
        </button>
    `
};

const ProblemPanel = {
    components: { TabButton },
    setup() {
        const activeTab = ref('description');
        
        return { activeTab };
    },
    template: `
        <div class="problem-panel">
            <div class="tabs">
                <TabButton 
                    :active="activeTab === 'description'" 
                    label="Description"
                    @click="activeTab = 'description'"
                />
                <TabButton 
                    :active="activeTab === 'solution'" 
                    label="Solution"
                    @click="activeTab = 'solution'"
                />
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
    `
};

const CodeEditor = {
    props: ['modelValue', 'language'],
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        let editor = null;
        
        onMounted(() => {
            require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
            
            require(['vs/editor/editor.main'], function() {
                editor = monaco.editor.create(document.getElementById('editor'), {
                    value: props.modelValue,
                    language: props.language,
                    theme: 'vs-dark',
                    automaticLayout: true,
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false
                });
                
                editor.onDidChangeModelContent(() => {
                    emit('update:modelValue', editor.getValue());
                });
            });
        });
        
        watch(() => props.language, (newLang) => {
            if (editor) {
                monaco.editor.setModelLanguage(editor.getModel(), newLang);
            }
        });
        
        watch(() => props.modelValue, (newValue) => {
            if (editor && editor.getValue() !== newValue) {
                editor.setValue(newValue);
            }
        });
        
        return {};
    },
    template: `<div id="editor"></div>`
};

const ConsoleOutput = {
    props: ['output'],
    emits: ['clear'],
    template: `
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
    `
};

const EditorPanel = {
    components: { CodeEditor, ConsoleOutput },
    props: ['code', 'language', 'output'],
    emits: ['update:code', 'update:language', 'run', 'submit', 'clearOutput'],
    template: `
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
    `
};

// Main App
const App = {
    components: { AppHeader, ProblemPanel, EditorPanel },
    setup() {
        const codeTemplates = {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Write your code here
    
}`,
            python: `def twoSum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Write your code here
    pass`,
            java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`
        };
        
        const testCases = [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
            { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
            { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
        ];
        
        const language = ref('javascript');
        const code = ref(codeTemplates.javascript);
        const output = ref([]);
        
        watch(language, (newLang) => {
            code.value = codeTemplates[newLang];
        });
        
        const addOutput = (text, type = '') => {
            output.value.push({ text, type });
        };
        
        const clearOutput = () => {
            output.value = [];
        };
        
        const runCode = () => {
            clearOutput();
            addOutput('Running test case 1...', 'output-info');
            
            if (language.value === 'javascript') {
                try {
                    eval(code.value);
                    const result = twoSum(testCases[0].input.nums, testCases[0].input.target);
                    
                    addOutput(`Input: nums = [${testCases[0].input.nums}], target = ${testCases[0].input.target}`);
                    addOutput(`Output: [${result}]`);
                    addOutput(`Expected: [${testCases[0].expected}]`);
                    
                    if (JSON.stringify(result.sort()) === JSON.stringify(testCases[0].expected.sort())) {
                        addOutput('✓ Test passed!', 'output-success');
                    } else {
                        addOutput('✗ Test failed!', 'output-error');
                    }
                } catch (error) {
                    addOutput(`Error: ${error.message}`, 'output-error');
                }
            } else {
                addOutput('Only JavaScript execution is supported in this demo.', 'output-info');
            }
        };
        
        const submitCode = () => {
            clearOutput();
            addOutput('Running all test cases...', 'output-info');
            
            if (language.value === 'javascript') {
                try {
                    eval(code.value);
                    let passed = 0;
                    
                    testCases.forEach((test, index) => {
                        const result = twoSum(test.input.nums, test.input.target);
                        const success = JSON.stringify(result.sort()) === JSON.stringify(test.expected.sort());
                        
                        addOutput(
                            `Test ${index + 1}: ${success ? '✓ Passed' : '✗ Failed'}`,
                            success ? 'output-success' : 'output-error'
                        );
                        
                        if (success) passed++;
                    });
                    
                    addOutput('━━━━━━━━━━━━━━━━━━━━', 'output-info');
                    addOutput(
                        `${passed}/${testCases.length} test cases passed`,
                        passed === testCases.length ? 'output-success' : 'output-error'
                    );
                    
                    if (passed === testCases.length) {
                        addOutput('🎉 All tests passed! Submission accepted.', 'output-success');
                    }
                } catch (error) {
                    addOutput(`Error: ${error.message}`, 'output-error');
                }
            } else {
                addOutput('Only JavaScript execution is supported in this demo.', 'output-info');
            }
        };
        
        return {
            language,
            code,
            output,
            runCode,
            submitCode,
            clearOutput
        };
    },
    template: `
        <div class="container">
            <AppHeader />
            <div class="main-content">
                <ProblemPanel />
                <EditorPanel 
                    :code="code"
                    :language="language"
                    :output="output"
                    @update:code="code = $event"
                    @update:language="language = $event"
                    @run="runCode"
                    @submit="submitCode"
                    @clearOutput="clearOutput"
                />
            </div>
        </div>
    `
};

createApp(App).mount('#app');
