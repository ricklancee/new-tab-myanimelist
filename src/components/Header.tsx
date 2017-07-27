import * as React from 'react'
import './Header.css'

interface Props {
  onLogout: Function
  onListToggle: Function
}

interface State {
  list: 'seasonal'|'myanimelist'
}

export default class Header extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      list: 'myanimelist'
    }

    this.toggleList = this.toggleList.bind(this)
  }

  toggleList() {
    this.setState({
      list: this.state.list === 'myanimelist' ? 'seasonal' : 'myanimelist'
    })

    this.props.onListToggle()
  }

  render() {
    const { list } = this.state
    return (
        <header className="Header">
          <div className="brandmark">
            <h1>{process.env.REACT_APP_TITLE}<span className="heart">❤</span></h1>
            <button
              className="Header__list-toggle"
              onClick={this.toggleList}
            >
              {list === 'myanimelist' ? 'Show this season' : 'Show my list'}
            </button>
          </div>
          <button className="Header__logout" onClick={() => this.props.onLogout()}>Logout</button>
        </header>
    )
  }
}
