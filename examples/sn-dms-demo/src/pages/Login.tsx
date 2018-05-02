import { Reducers } from '@sensenet/redux'
import Button from 'material-ui/Button'
import FormControl from 'material-ui/Form/FormControl'
import FormHelperText from 'material-ui/Form/FormHelperText'
import Input from 'material-ui/Input'
import InputLabel from 'material-ui/Input/InputLabel'
import createMuiTheme from 'material-ui/styles/createMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import LoginTabs from '../components/LoginTabs'
import { OauthRow } from '../components/OAuthRow'
import { WelcomeMessage } from '../components/WelcomeMessage'
import * as DMSReducers from '../Reducers'

// tslint:disable-next-line:no-var-requires
const logo = require('../assets/logo.png')

import lightBlue from 'material-ui/colors/lightBlue'
import pink from 'material-ui/colors/pink'

const muiTheme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: pink,
  },
})

const styles = {
  button: {
    margin: '10px 0',
    width: '100%',
  },
  formControl: {
    marginTop: '20px 0px',
  },
  logo: {
    backgroundColor: '#fff',
    padding: '60px',
    color: '#444',
    textAlign: 'center'  as any,
  },
  logoMobile: {
    padding: '50px  0',
    textAlign: 'center'  as any,
  },
}

import { resources } from '../assets/resources'

interface LoginProps {
  login,
  params,
  loginError,
  clear,
  isRegistered
}

interface LoginState {
  email,
  password,
  emailError,
  passwordError,
  emailErrorMessage,
  passwordErrorMessage,
  formIsValid,
  isButtonDisabled
}

class Login extends React.Component<LoginProps, LoginState> {

  constructor(props) {
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

  public handleEmailBlur(e) {
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

  public handlePasswordBlur(e) {
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

  public handleEmailChange(e) {
    this.setState({
      email: e.target.value,
    })
  }

  public handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    })
  }

  public validateEmail(text) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(text)
  }

  public valid(e) {
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

  public formSubmit(e) {
    if (this.valid(e)) {
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
    return (
      <div className="Sensenet">
        <div className="Sensenet-header">
          <MediaQuery minDeviceWidth={700}>
            {(matches) => {
              return <img src={logo} width={matches ? '60%' : '50%'} className="Sensenet-logo" style={matches ? styles.logo : styles.logoMobile} alt="logo" />
            }}
          </MediaQuery>
        </div>

        <LoginTabs />
        <WelcomeMessage />

        <div>
          <MuiThemeProvider theme={muiTheme}>
            <form onSubmit={(e) => {
              e.preventDefault()
              this.formSubmit(e)
            }}>
              <FormControl
                error={this.state.emailError || (this.props.loginError && this.props.loginError.length) > 0 ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor="email">{resources.EMAIL_INPUT_LABEL}</InputLabel>
                <Input
                  id="email"
                  onBlur={(event) => this.handleEmailBlur(event)}
                  onChange={(event) => this.handleEmailChange(event)}
                  fullWidth
                  autoFocus
                  placeholder={resources.EMAIL_INPUT_PLACEHOLDER} />
                <FormHelperText>{this.state.emailErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl
                error={this.state.passwordError || (this.props.loginError && this.props.loginError.length) ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor="password">{resources.PASSWORD_INPUT_LABEL}</InputLabel>
                <Input
                  type="password"
                  id="password"
                  onBlur={(event) => this.handlePasswordBlur(event)}
                  onChange={(event) => this.handlePasswordChange(event)}
                  fullWidth
                  placeholder={resources.PASSWORD_INPUT_PLACEHOLDER} />
                <FormHelperText>{this.state.passwordErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormHelperText error>{this.props.loginError && this.props.loginError.length ? resources.WRONG_USERNAME_OR_PASSWORD : ''}</FormHelperText>
              </FormControl>
              <Button type="submit" color="primary" style={styles.button} disabled={this.props.loginError === null && this.state.isButtonDisabled}>{resources.LOGIN_BUTTON_TEXT}</Button>
            </form>
          </MuiThemeProvider>
          <OauthRow />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, match) => {
  return {
    loginError: Reducers.getAuthenticationError(state.sensenet),
    isRegistered: DMSReducers.registrationIsDone,
  }
}

export default connect(mapStateToProps, {})(Login)
