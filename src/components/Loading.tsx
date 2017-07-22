import * as React from 'react'
import './Loading.css'

interface Props {
  label?: string
  noDelay?: boolean
}

interface State {
  visible: boolean
}

export default class Loading extends React.Component<Props, State> {
  private element: HTMLElement|null
  private timer: number
  private animationInterval: number

  constructor(props: Props) {
    super(props)

    this.state = {
      visible: !!this.props.noDelay
    }
  }

  componentDidMount() {
    if (!this.props.noDelay) {
      this.timer = window.setTimeout(_ => {
        this.setState({
          visible: true
        })
      }, 300)
    }

    if (this.element) {
      const emojis = Array.from(this.element.querySelectorAll('.Loading__emoji'))

      // Add the class to the first emoji so it doesn't flip at the same time
      emojis[0].classList.add('Loading--flip')

      this.animationInterval = window.setInterval(_ => {
        emojis.forEach(emoji => emoji.classList.toggle('Loading--flip'))
      }, 600)
    }
  }

  componentWillUnmout() {
    window.clearTimeout(this.timer)
    window.clearTimeout(this.animationInterval)
  }

  render() {
    const { label } = this.props
    const { visible } = this.state

    const emoji = (
      <span className="Loading__emoji">(<span className="Loading__arm-left">╯</span>
        °□°）<span className="Loading__arm-right">╯</span>
      <span className="Loading__throw-effect">︵</span> <span className="Loading__table">┻━┻</span></span>
  )

    return (
      <div className={`Loading ${visible ? 'Loading--shown' : ''}`} ref={(el) => this.element = el}>
        {emoji} <span className="Loading__label">{label ? label : 'Loading...'}</span> {emoji}
      </div>
    )
  }
}
