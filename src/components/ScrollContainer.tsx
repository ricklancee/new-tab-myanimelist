import * as React from 'react'
import './ScrollContainer.css'

interface Props {
  onLoadMore: (callback: (done?: Boolean) => void) => void
}

export default class ScrollContainer extends React.Component<Props, {}> {

  private containerElement: HTMLElement
  private disabled: Boolean = false

  constructor(props: Props) {
    super(props)

    const boundOnScroll = this.onScroll.bind(this)
    this.onScroll = () => requestAnimationFrame(boundOnScroll)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    if (this.disabled) {
      return
    }

    let containerHeight = this.containerElement.offsetHeight + this.containerElement.offsetTop
    const distance = containerHeight - (window.scrollY + window.innerHeight)

    if (distance <= window.innerHeight) {
      this.disabled = true

      this.props.onLoadMore(() => {
        this.disabled = false
      })
    }
  }

  render() {
    return (
        <ul className="ScrollContainer" ref={(el) => this.containerElement = el as HTMLElement}>
          {this.props.children}
        </ul>
    )
  }
}
