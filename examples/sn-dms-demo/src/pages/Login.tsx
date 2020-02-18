import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import { Actions, Reducers } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Redirect } from 'react-router-dom'
import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { OauthProvider } from '@sensenet/authentication-jwt'
import { LoginState } from '@sensenet/client-core'
import ConnectedLoginTabs from '../components/LoginTabs'
import { OauthRow } from '../components/OAuthRow'
import { WelcomeMessage } from '../components/WelcomeMessage'
import { resources } from '../assets/resources'
import { FullScreenLoader } from '../components/FullScreenLoader'
import { rootStateType } from '../store/rootReducer'
import logo from '../assets/logo.png'

const styles = {
  button: {
    margin: '30px auto',
    display: 'block',
  },
  formControl: {
    marginTop: '20px 0px',
  },
  logo: {
    backgroundColor: '#fff',
    padding: '60px',
    color: '#444',
    textAlign: 'center' as any,
  },
  logoMobile: {
    padding: '50px  0',
    textAlign: 'center' as any,
  },
}

const mapStateToProps = (state: rootStateType) => {
  return {
    loginState: state.sensenet.session.loginState,
    loginError: Reducers.getAuthenticationError(state.sensenet),
    isRegistered: state.dms.register.registrationDone,
  }
}

const mapDispatchToProps = {
  login: Actions.userLogin,
}

interface LoginProps {
  clear: () => any
  loginState: LoginState
  oauthProvider: OauthProvider | GoogleOauthProvider
}

interface LoginComponentState {
  username: string
  password: string
  usernameError: boolean
  passwordError: boolean
  usernameErrorMessage: string
  passwordErrorMessage: string
  formIsValid: boolean
  isButtonDisabled: boolean
}

class Login extends React.Component<
  LoginProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  LoginComponentState
> {
  constructor(props: Login['props']) {
    super(props)
    this.state = {
      username: '',
      password: '',
      usernameError: false,
      passwordError: false,
      usernameErrorMessage: '',
      passwordErrorMessage: '',
      formIsValid: false,
      isButtonDisabled: false,
    }

    this.handleUsernameBlur = this.handleUsernameBlur.bind(this)
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleUsernameChange = this.handleUsernameChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
    this.buttonIsDisabled = this.buttonIsDisabled.bind(this)
  }

  public handleUsernameBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.target.value.length > 0) {
      this.setState({
        username: e.target.value,
        usernameErrorMessage: '',
        usernameError: false,
      })
    } else {
      this.setState({
        usernameErrorMessage: resources.USERNAME_IS_NOT_VALID_MESSAGE,
        usernameError: true,
      })
    }
  }

  public handlePasswordBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.target.value.length > 0) {
      this.setState({
        password: e.target.value,
        passwordErrorMessage: '',
        passwordError: false,
      })
    } else {
      this.setState({
        passwordErrorMessage: resources.PASSWORD_IS_NOT_VALID_MESSAGE,
        passwordError: true,
      })
    }
  }

  public handleUsernameChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({
      username: e.target.value,
    })
  }

  public handlePasswordChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({
      password: e.target.value,
    })
  }

  public valid() {
    let valid = true
    if (this.state.username === '') {
      valid = false
      this.setState({
        usernameErrorMessage: resources.USERNAME_IS_NOT_VALID_MESSAGE,
        usernameError: true,
      })
    }
    if (this.state.password === '') {
      valid = false
      this.setState({
        passwordErrorMessage: resources.PASSWORD_IS_NOT_VALID_MESSAGE,
        passwordError: true,
      })
    }
    return valid
  }

  public formSubmit() {
    if (this.valid()) {
      this.props.login(this.state.username, this.state.password)
      this.setState({
        isButtonDisabled: true,
      })
    }
  }

  public buttonIsDisabled() {
    if (this.props.loginError && this.props.loginError.length) {
      this.setState({
        isButtonDisabled: false,
      })
    }
    return this.state.isButtonDisabled
  }

  public componentDidMount() {
    if (this.props.isRegistered) {
      this.props.clear()
    }
  }

  public render() {
    if (this.props.loginState === LoginState.Authenticated) {
      return <Redirect to="/documents/" />
    }

    if (this.props.loginState === LoginState.Pending) {
      return <FullScreenLoader />
    }

    return (
      <div className="Sensenet">
        <div className="Sensenet-header">
          <MediaQuery minDeviceWidth={700}>
            {matches => {
              return (
                <img
                  src={logo}
                  width={matches ? '60%' : '50%'}
                  className="Sensenet-logo"
                  style={matches ? styles.logo : styles.logoMobile}
                  alt="logo"
                />
              )
            }}
          </MediaQuery>
        </div>

        <ConnectedLoginTabs />
        <WelcomeMessage />

        <div>
          <form
            onSubmit={e => {
              e.preventDefault()
              this.formSubmit()
            }}>
            <FormControl
              error={
                this.state.usernameError || (this.props.loginError && this.props.loginError.length > 0) ? true : false
              }
              fullWidth={true}
              required={true}
              style={styles.formControl}>
              <TextField
                name="username"
                onBlur={event => this.handleUsernameBlur(event)}
                onChange={event => this.handleUsernameChange(event)}
                fullWidth={true}
                autoFocus={true}
                label={resources.USERNAME_INPUT_LABEL}
                placeholder={resources.USERNAME_INPUT_PLACEHOLDER}
              />
              <FormHelperText>{this.state.usernameErrorMessage}</FormHelperText>
            </FormControl>
            <FormControl
              error={this.state.passwordError || (this.props.loginError && this.props.loginError.length) ? true : false}
              fullWidth={true}
              required={true}
              style={styles.formControl}>
              <TextField
                type="password"
                name="password"
                onBlur={event => this.handlePasswordBlur(event)}
                onChange={event => this.handlePasswordChange(event)}
                fullWidth={true}
                label={resources.PASSWORD_INPUT_LABEL}
                placeholder={resources.PASSWORD_INPUT_PLACEHOLDER}
              />
              <FormHelperText>{this.state.passwordErrorMessage}</FormHelperText>
            </FormControl>
            <FormControl>
              <FormHelperText error={true}>
                {this.props.loginError && this.props.loginError.length ? resources.WRONG_USERNAME_OR_PASSWORD : ''}
              </FormHelperText>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={styles.button}
              disabled={this.props.loginError === null && this.state.isButtonDisabled}>
              {resources.LOGIN_BUTTON_TEXT}
            </Button>
          </form>
          <OauthRow oAuthProvider={this.props.oauthProvider} />
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
