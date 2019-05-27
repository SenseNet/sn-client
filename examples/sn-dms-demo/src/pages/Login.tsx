import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import { Actions, Reducers } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { Redirect } from 'react-router-dom'
import LoginTabs from '../components/LoginTabs'
import { OauthRow } from '../components/OAuthRow'
import { WelcomeMessage } from '../components/WelcomeMessage'

// tslint:disable-next-line:no-var-requires
const logo = require('../assets/logo.png')

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

import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { OauthProvider } from '@sensenet/authentication-jwt'
import { LoginState } from '@sensenet/client-core'
import { resources } from '../assets/resources'
import { FullScreenLoader } from '../components/FullScreenLoader'
import { rootStateType } from '../store/rootReducer'

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
  email: string
  password: string
  emailError: boolean
  passwordError: boolean
  emailErrorMessage: string
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
      email: '',
      password: '',
      emailError: false,
      passwordError: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      formIsValid: false,
      isButtonDisabled: false,
    }

    this.handleEmailBlur = this.handleEmailBlur.bind(this)
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.formSubmit = this.formSubmit.bind(this)
    this.buttonIsDisabled = this.buttonIsDisabled.bind(this)
  }

  public handleEmailBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (this.validateEmail(e.target.value)) {
      this.setState({
        email: e.target.value,
        emailErrorMessage: '',
        emailError: false,
      })
    } else {
      this.setState({
        emailErrorMessage: resources.EMAIL_IS_NOT_VALID_MESSAGE,
        emailError: true,
      })
    }
  }

  public handlePasswordBlur(e: React.FocusEvent<HTMLInputElement>) {
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

  public handleEmailChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({
      email: e.target.value,
    })
  }

  public handlePasswordChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({
      password: e.target.value,
    })
  }

  public validateEmail(text: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(text)
  }

  public valid() {
    let valid = true
    if (this.state.email === '' || !this.validateEmail(this.state.email)) {
      valid = false
      this.setState({
        emailErrorMessage: resources.EMAIL_IS_NOT_VALID_MESSAGE,
        emailError: true,
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
      this.props.login(this.state.email, this.state.password)
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
    // tslint:disable-next-line:no-unused-expression
    this.props.isRegistered ? this.props.clear() : false
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

        <LoginTabs />
        <WelcomeMessage />

        <div>
          <form
            onSubmit={e => {
              e.preventDefault()
              this.formSubmit()
            }}>
            <FormControl
              error={
                this.state.emailError || (this.props.loginError && this.props.loginError.length > 0) ? true : false
              }
              fullWidth={true}
              required={true}
              style={styles.formControl}>
              <TextField
                name="email"
                onBlur={event => this.handleEmailBlur(event)}
                onChange={event => this.handleEmailChange(event)}
                fullWidth={true}
                autoFocus={true}
                label={resources.EMAIL_INPUT_LABEL}
                placeholder={resources.EMAIL_INPUT_PLACEHOLDER}
              />
              <FormHelperText>{this.state.emailErrorMessage}</FormHelperText>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
