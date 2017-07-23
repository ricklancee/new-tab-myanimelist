declare global {
  interface Window { requestIdleCallback: (callback: Function, options?: {timeout?: number}) => void}
}

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './variables.css'
import './index.css'

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)
