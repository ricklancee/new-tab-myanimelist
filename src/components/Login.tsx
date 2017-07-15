import * as React from 'react'
import './Login.css'
import MALjs from '../support/Api'
import { sample, isPlainObject } from 'lodash'

interface State {
  isLoading: Boolean
  hasFailed: Boolean
  error: string|undefined
  attempts: number
}

interface Props {
  onLogin: (user: {username: string, password: string}) => void
}

const bestPass = [
  'Bot-chan is best girl',
  'Your waifu is trash',
  'Yui is best girl',
  'no waifu, no laifu',
  'Megumin is best girl',
  'Misaka is best girl',
  'Koko is best girl',
  'Utaha is best girl',
  'Mugi is best girl',
  'B-b-b-baka~~~',
  'Kikko is best girl',
  'Tohsaka is best girl',
  'Watashi is best girl',
  'Ene is best girl'
]

const weaboos = [
  'Sailor_Koi_Captain',
  'Desu-Ero-Tan46521',
  'TrashySugoiGem',
  'JusticeLover26201',
  'KawaiiPartyGirl',
  'Power_Moon',
  'EroAishiteruNoob',
  'MoeFreak',
  'Zero_Person',
  'Nihon_Ero_San',
  'zomgSeppukuSama',
  'xxx_zomgPokemonSucks33333_xxx',
  'School_Rose_Tan',
  'AnimeRoseMaid',
  'RoyalUniverseLady',
  'SanAishiteruWarrior',
  'Sushi99',
  'Royal_Hatsune_Sensei',
  'Cupcake_Chan4444'
]

export default class Login extends React.Component<Props, State> {
  private api: MALjs

  private usernamePlaceholder: string
  private passwordPlaceholder: string

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false,
      hasFailed: false,
      error: undefined,
      attempts: 0
    }

    this.usernamePlaceholder = sample(weaboos) as string
    this.passwordPlaceholder = sample(bestPass) as string

    this.api = new MALjs()

    this.login = this.login.bind(this)
  }

  // tslint:disable-next-line
  async login(event: any) { // setting a type for event here is too much overhead
    event.preventDefault()

    if (this.state.isLoading) {
      return
    }

    this.setState({
      isLoading: true,
      hasFailed: false,
    })

    const data = new FormData(event.target)

    const username = data.get('username') as string
    const password = data.get('password') as string

    this.api.setCredentials(username, password)

    const result = await this.api.verifyCredentials() as string | {}

    if (!isPlainObject(result)) {
      this.setState({
        isLoading: false,
        hasFailed: true,
        error: result as string,
        attempts: this.state.attempts + 1
      })
      return
    }

    this.setState({
      isLoading: false,
      hasFailed: false,
    })

    this.props.onLogin({username, password})
  }

  render() {
    const { isLoading, hasFailed, attempts } = this.state

    return (
      <div className={`Login ${isLoading ? 'Login--loading' : ''}`}>
        <div>
          <form onSubmit={this.login}>
            <h4>Login to MyAnimeList.net</h4>
            <label>Your MAL Username</label>
            <input type="text" placeholder={this.usernamePlaceholder} name="username" required={true} />
            <label>Your MAL password</label>
            <input type="password" placeholder={this.passwordPlaceholder} name="password" required={true} />

            <div className="submit">
              { isLoading && (
                <div className="spinner">
                  <div className="rect1" />
                  <div className="rect2" />
                  <div className="rect3" />
                  <div className="rect4" />
                  <div className="rect5" />
                </div>
              )}
              <button type="submit"><span>Login</span></button>
            </div>

            {hasFailed ? (
                <p className="error">
                   { attempts > 4 && (
                    <strong>
                      Too many failed login attemps will result in a temporary 2 hour ban from MAL!
                      <br />
                    </strong>
                   )}
                  Failed to login into Myanimelist.<br />
                  <small>{this.state.error}</small>
                </p>
              ) : (
                <p>Your username and password are stored locally in the browser as plain text.</p>
              )
            }
          </form>
        </div>
      </div>
    )
  }
}
