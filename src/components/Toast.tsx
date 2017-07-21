import * as React from 'react'
import './Toast.css'
import { default as toaster } from '../support/toast'

interface State {
  toast: {
    type: 'error'|'success'|'info'
    message: string
  } | null
}

export default class Toast extends React.Component<{}, State> {
  private lastMessage: string = ''
  private lastType: string = ''

  constructor(props: {}) {
    super(props)

    this.state = {
      toast: null
    }
  }

  componentDidMount() {
    toaster.on('error', (message) => {
      this.setToast('error', message)
    })
    toaster.on('success', (message) => {
      this.setToast('success', message)
    })
    toaster.on('info', (message) => {
      this.setToast('info', message)
    })
  }

  setToast(type: string, message: string) {
    this.setState({
      toast: {
        type: 'error',
        message: message
      }
    })

    setTimeout(_ => {
      this.setState({
        toast: null
      })
    }, 3000)
  }

  render() {
    const { toast } = this.state

    if (toast) {
      this.lastMessage = toast.message
      this.lastType = toast.type
    }

    return (
      <div className={`Toast ${this.lastType && 'Toast--' + this.lastType} ${toast ? 'Toast--show' : ''}`}>
        {this.lastMessage}
      </div>
    )
  }
}
