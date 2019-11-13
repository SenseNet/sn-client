import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { OauthProvider } from '@sensenet/authentication-jwt'
import { userRegistration } from '../Actions'
import GoogleReCaptcha from '../components/GoogleReCaptcha'
import ConnectedLoginTabs from '../components/LoginTabs'
import { OauthRow } from '../components/OAuthRow'
import { WelcomeMessage } from '../components/WelcomeMessage'
import { resources } from '../assets/resources'
import { rootStateType } from '../store/rootReducer'
import logo from '../assets/logo.png'

const styles = {
  button: {
    margin: '30px 0',
  },
  formControl: {
    marginTop: '20px 0px',
  },
  progress: {
    position: 'absolute' as any,
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.5)',
    textAlign: 'center' as any,
    zIndex: 10,
    padding: '120px 0',
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
    registrationError: state.dms.register.registrationError,
    inProgress: state.dms.register.isRegistering,
    isRegistered: state.dms.register.registrationDone,
    isNotARobot: state.dms.register.captcha,
  }
}

const mapDispatchToProps = {
  registration: userRegistration,
}

interface RegistrationProps extends RouteComponentProps<any> {
  verify: any
  oAuthProvider: OauthProvider
}

interface RegistrationState {
  email: string
  password: string
  confirmpassword: string
  emailError: boolean
  passwordError: boolean
  confirmPasswordError: boolean
  emailErrorMessage: string
  passwordErrorMessage: string
  confirmPasswordErrorMessage: string
  formIsValid: boolean
  isButtonDisabled: boolean
  captchaError: boolean
  captchaErrorMessage: string
}

class Registration extends React.Component<
  RegistrationProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  RegistrationState
> {
  constructor(props: Registration['props']) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmpassword: '',
      emailError: false,
      passwordError: false,
      emailErrorMessage: '',
      passwordErrorMessage: '',
      formIsValid: false,
      isButtonDisabled: false,
      confirmPasswordError: false,
      confirmPasswordErrorMessage: '',
      captchaError: false,
      captchaErrorMessage: '',
    }

    this.handleEmailBlur = this.handleEmailBlur.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleConfirmPasswordBlur = this.handleConfirmPasswordBlur.bind(this)
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
  }
  public handleEmailBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.validateEmail(e.target.value)) {
      this.setState({
        email: e.target.value,
        emailErrorMessage: '',
        emailError: false,
        isButtonDisabled: false,
      })
    } else {
      this.setState({
        emailErrorMessage: resources.EMAIL_IS_NOT_VALID_MESSAGE,
        emailError: true,
      })
    }
  }
  public handleEmailChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({
      email: e.target.value,
      isButtonDisabled: false,
    })
  }
  public validateEmail(text: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(text)
  }
  public handlePasswordBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.validatePassword(e.target.value)) {
      this.setState({
        password: e.target.value,
        passwordErrorMessage: '',
        passwordError: false,
        isButtonDisabled: false,
      })
    } else {
      this.setState({
        passwordErrorMessage: resources.PASSWORD_SHOULD_BE_VALID,
        passwordError: true,
      })
    }
  }
  public handlePasswordChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    this.setState({
      password: e.target.value,
      isButtonDisabled: false,
    })
  }
  public validatePassword(text: string) {
    const re = /^([a-zA-Z0-9!@#$%^&*)(+=._-]*[a-zA-Z0-9!@#$%^&*)(+=._-]){3}[a-zA-Z0-9!@#$%^&*)(+=._-]*$/
    return re.test(text)
  }
  public handleConfirmPasswordBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (e.target.value.length !== 0 && this.confirmPasswords(e.target.value, this.state.password)) {
      this.setState({
        confirmpassword: e.target.value,
        confirmPasswordErrorMessage: '',
        confirmPasswordError: false,
        isButtonDisabled: false,
      })
    } else if (!this.validatePassword(e.target.value)) {
      this.setState({
        confirmPasswordErrorMessage: resources.PASSWORD_SHOULD_BE_VALID,
        confirmPasswordError: true,
      })
    } else {
      this.setState({
        confirmPasswordErrorMessage: resources.PASSWORDS_SHOULD_MATCH,
        confirmPasswordError: true,
      })
    }
  }
  public handleConfirmPasswordChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    if (this.validatePassword(e.target.value) && this.confirmPasswords(e.target.value, this.state.password)) {
      this.setState({
        confirmpassword: e.target.value,
        isButtonDisabled: false,
      })
    }
  }
  public confirmPasswords(p1: string, p2: string) {
    return p1 === p2
  }
  public formSubmit() {
    if (this.valid()) {
      this.props.registration(this.state.email, this.state.password)
      this.setState({
        isButtonDisabled: true,
      })
    }
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
    if (this.state.password === '' || !this.validatePassword(this.state.password)) {
      valid = false
      this.setState({
        passwordErrorMessage: resources.PASSWORD_IS_NOT_VALID_MESSAGE,
        passwordError: true,
      })
    }
    if (this.state.confirmpassword === '') {
      valid = false
      this.setState({
        confirmPasswordErrorMessage: resources.PASSWORD_IS_NOT_VALID_MESSAGE,
        confirmPasswordError: true,
      })
    }
    if (!this.confirmPasswords(this.state.password, this.state.confirmpassword)) {
      valid = false
      this.setState({
        confirmPasswordErrorMessage: resources.PASSWORDS_SHOULD_MATCH,
        confirmPasswordError: true,
      })
    }
    if (!this.props.isNotARobot && process.env.NODE_ENV !== 'test') {
      valid = false
      this.setState({
        captchaErrorMessage: resources.CAPTCHA_ERROR,
        captchaError: true,
      })
    }
    return valid
  }
  public render() {
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
          <div>
            {this.props.isRegistered ? this.props.history.push('/login') : false}
            {this.props.inProgress ? (
              <div style={styles.progress}>
                <CircularProgress color="secondary" />
              </div>
            ) : (
              ''
            )}
            <form
              onSubmit={e => {
                e.preventDefault()
                this.formSubmit()
              }}>
              <FormControl
                error={
                  this.state.emailError ||
                  (this.props.registrationError !== null && this.props.registrationError.length) > 0
                    ? true
                    : false
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
                  placeholder={resources.EMAIL_INPUT_FORMAT_PLACEHOLDER}
                />
                <FormHelperText>{this.state.emailErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl
                error={this.state.passwordError ? true : false}
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
              <FormControl
                error={this.state.confirmPasswordError ? true : false}
                fullWidth={true}
                required={true}
                style={styles.formControl}>
                <TextField
                  type="password"
                  name="confirmpassword"
                  onBlur={event => this.handleConfirmPasswordBlur(event)}
                  onChange={event => this.handleConfirmPasswordChange(event)}
                  fullWidth={true}
                  label={resources.CONFIRM_PASSWORD_INPUT_LABEL}
                  placeholder={resources.PASSWORD_INPUT_PLACEHOLDER}
                />
                <FormHelperText>{this.state.confirmPasswordErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl>
                <GoogleReCaptcha verify={this.props.verify} />
                <FormHelperText error={true}>
                  {this.state.captchaError && this.state.captchaErrorMessage.length > 0
                    ? this.state.captchaErrorMessage
                    : ''}
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormHelperText error={true}>
                  {this.props.registrationError && this.props.registrationError.length > 0
                    ? this.props.registrationError
                    : ''}
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                style={styles.button}
                disabled={this.state.isButtonDisabled}>
                {resources.REGISTRATION_BUTTON_TEXT}
              </Button>
            </form>
            <OauthRow oAuthProvider={this.props.oAuthProvider} />
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Registration))
