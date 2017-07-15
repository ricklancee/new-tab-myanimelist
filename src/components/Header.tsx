import * as React from 'react'
import './Header.css'

interface Props {
  onLogout: Function
}

export default (props: Props) => {
    return (
        <header className="Header">
          <div className="brandmark">
            <h1>New tab: MyAnimeList<span className="heart">❤</span></h1>
          </div>
          <button className="Header__logout" onClick={() => props.onLogout()}>Logout</button>
        </header>
    )
}
