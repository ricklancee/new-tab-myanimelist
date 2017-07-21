type Callback = (message: string) => void
const callbacks = {
  error: [] as Callback[],
  success: [] as Callback[],
  info: [] as Callback[],
}

export default (function toast() {
  return {
    on: (type: 'error'|'success'|'info', callback: (message: string) => void) => {
      callbacks[type].push(callback)
    },
    error: (message: string) => {
      // Wait a frame so the stack is cleared and the callbacks get added
      requestAnimationFrame(_ => {
        callbacks.error.forEach(callback => {
          callback(message)
        })
      })
    }
  }
}())
