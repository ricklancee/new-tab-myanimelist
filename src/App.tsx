import * as React from 'react'
import './App.css'
import Login from './components/Login'
import ListContainer from './components/ListContainer'
import SeasonList from './components/SeasonList'
import Header from './components/Header'
import { storage } from './support/Store'

interface State {
  user: {
    username: string,
    password: string
  } | null
  isLoading: boolean
  showSeasonalList: boolean
}

class App extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props)

    this.state = {
      user: null,
      isLoading: true,
      showSeasonalList: false
    }

    this.getCurrentUser().then(user => {
      this.setState({
        user: user,
        isLoading: false
      })
    })

    this.onLogout = this.onLogout.bind(this)
    this.onLogin  = this.onLogin.bind(this)
    this.toggleSeasonalList = this.toggleSeasonalList.bind(this)
  }

  getCurrentUser() {
    return storage.get('app.user') as Promise<{
      username: string,
      password: string
    }|null>
  }

  onLogin(user: {username: string, password: string}) {
    storage.set('app.user', user)
    this.setState({user})
  }

  onLogout() {
    storage.remove('app.user')
    this.setState({user: null})
  }

  toggleSeasonalList() {
    this.setState({
      showSeasonalList: !this.state.showSeasonalList
    })
  }

  render() {
    if (this.state.isLoading) {
      return <div />
    }

    if (!this.state.user) {
      return (
        <Login onLogin={this.onLogin}/>
      )
    }

    return (
      <div className="app">
        <Header onLogout={this.onLogout} onListToggle={this.toggleSeasonalList}/>

        {this.state.showSeasonalList ? (
          <SeasonList />
        ) : (
          <ListContainer user={this.state.user}/>
        )}
      </div>
    )
  }
}

export default App
