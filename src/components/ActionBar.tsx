import * as React from 'react'
import './ActionBar.css'
import { Status, toReadableStatus } from './Show'

interface Props {
  onFilter: (status: Status|'all') => void
  onSearch: (query: string) => void
}

interface State {
  filteredByStatus: Status|'all',
}

interface ButtonProps {
  status: Status|'all'
  onClick: Function,
  isActive: boolean
}

export default class ActionBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      filteredByStatus: Status.watching // default filter
    }

    this.filter = this.filter.bind(this)
    this.search = this.search.bind(this)
  }

  filter({status}: {status: Status|'all'}) {
    this.setState({filteredByStatus: status})

    // Improve percieved performance
    requestAnimationFrame(() => this.props.onFilter(status))
  }

  // tslint:disable-next-line:no-any
  search(event: any) {
    const value = event.target.value

    this.props.onSearch(value)
  }

  render() {
    return (
      <div className="ActionBar">
        <div className="ActionBar__filter-status">
          <FilterButton
            status={'all'}
            onClick={this.filter}
            isActive={this.state.filteredByStatus === 'all'}
          >
            All
          </FilterButton>
          <FilterButton
            status={Status.watching}
            onClick={this.filter}
            isActive={this.state.filteredByStatus === Status.watching}
          >
            Watching
          </FilterButton>
          <FilterButton
            status={Status.completed}
            onClick={this.filter}
            isActive={this.state.filteredByStatus === Status.completed}
          >
            Completed
          </FilterButton>
          <FilterButton
            status={Status.onhold}
            onClick={this.filter}
            isActive={this.state.filteredByStatus === Status.onhold}
          >
            On hold
          </FilterButton>
          <FilterButton
            status={Status.dropped}
            onClick={this.filter}
            isActive={this.state.filteredByStatus === Status.dropped}
          >
            Dropped
          </FilterButton>
          <FilterButton
            status={Status.plantowatch}
            onClick={this.filter}
            isActive={this.state.filteredByStatus === Status.plantowatch}
          >
            Plan to watch
          </FilterButton>
        </div>
        <div className="ActionBar__search">
          <div className="ActionBar__search-container">
            <input type="text" placeholder="search" onChange={this.search} />
          </div>
        </div>
      </div>
    )
  }
}

class FilterButton extends React.Component<ButtonProps, {isActive: boolean}> {
  constructor(props: ButtonProps) {
    super(props)

    this.state = {
      isActive: props.isActive
    }
  }

  componentWillReceiveProps(nextProps: ButtonProps) {
    this.setState({
      isActive: nextProps.isActive
    })
  }

  render() {
    return (
      <button
        onClick={() => this.props.onClick({status: this.props.status})}
        className={`
          ActionBar__status-filter
          ActionBar__status-filter--${this.props.status === 'all' ? 'all' : toReadableStatus(this.props.status)}
          ${this.state.isActive ? 'ActionBar__status-filter--active' : ''}
        `}
      >
        {this.props.children}
      </button>
    )
  }
}
