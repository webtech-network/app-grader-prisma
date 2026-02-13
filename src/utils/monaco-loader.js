let monacoPromise = null

export function loadMonaco() {
  if (monacoPromise) return monacoPromise
  
  monacoPromise = new Promise((resolve) => {
    if (window.monaco) {
      resolve(window.monaco)
      return
    }
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js'
    script.onload = () => {
      window.require.config({ 
        paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
      })
      
      window.require(['vs/editor/editor.main'], () => {
        resolve(window.monaco)
      })
    }
    document.head.appendChild(script)
  })
  
  return monacoPromise
}
