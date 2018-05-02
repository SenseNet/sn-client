import Button from 'material-ui/Button'
import FormControl from 'material-ui/Form/FormControl'
import FormHelperText from 'material-ui/Form/FormHelperText'
import Input from 'material-ui/Input'
import InputLabel from 'material-ui/Input/InputLabel'
import { CircularProgress } from 'material-ui/Progress'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { withRouter } from 'react-router-dom'
import GoogleReCaptcha from '../components/GoogleReCaptcha'
import LoginTabs from '../components/LoginTabs'
import { OauthRow } from '../components/OAuthRow'
import { WelcomeMessage } from '../components/WelcomeMessage'
import * as DMSReducers from '../Reducers'

// tslint:disable-next-line:no-var-requires
const logo = require('../assets/logo.png')

const styles = {
  button: {
    margin: '10px 0',
    width: '100%',
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

import { resources } from '../assets/resources'

interface RegistrationProps {
  history,
  registration,
  verify,
  params,
  registrationError,
  inProgress,
  isRegistered,
  isNotARobot
}

interface RegistrationState {
  email,
  password,
  confirmpassword,
  emailError,
  passwordError,
  confirmPasswordError,
  emailErrorMessage,
  passwordErrorMessage,
  confirmPasswordErrorMessage,
  formIsValid,
  isButtonDisabled,
  captchaError,
  captchaErrorMessage
}

class Registration extends React.Component<RegistrationProps, RegistrationState> {

  constructor(props) {
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
  public handleEmailBlur(e) {
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
  public handleEmailChange(e) {
    this.setState({
      email: e.target.value,
      isButtonDisabled: false,
    })
  }
  public validateEmail(text) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(text)
  }
  public handlePasswordBlur(e) {
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
  public handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
      isButtonDisabled: false,
    })
  }
  public validatePassword(text) {

    const re = /^([a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]*[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]){3}[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]*$/
    return re.test(text)
  }
  public handleConfirmPasswordBlur(e) {
    if (e.target.value.length !== 0 && this.confirmPasswords(e.target.value, this.state.password)) {
      this.setState({
        confirmpassword: e.target.value,
        confirmPasswordErrorMessage: '',
        confirmPasswordError: false,
        isButtonDisabled: false,
      })
    } else if (!this.validatePassword(e.target.value)) {
      this.setState({
        passwordErrorMessage: resources.PASSWORD_SHOULD_BE_VALID,
        passwordError: true,
      })
    } else {
      this.setState({
        confirmPasswordErrorMessage: resources.PASSWORDS_SHOULD_MATCH,
        confirmPasswordError: true,
      })
    }
  }
  public handleConfirmPasswordChange(e) {
    if (this.validatePassword(e.target.value) && this.confirmPasswords(e.target.value, this.state.password)) {
      this.setState({
        confirmpassword: e.target.value,
        isButtonDisabled: false,
      })
    }
  }
  public confirmPasswords(p1, p2) {
    return p1 === p2
  }
  public formSubmit(e) {
    if (this.valid(e)) {
      this.props.registration(this.state.email, this.state.password)
      this.setState({
        isButtonDisabled: true,
      })
    }
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
    if (!this.props.isNotARobot) {
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
            {(matches) => {
              return <img src={logo} width={matches ? '60%' : '50%'} className="Sensenet-logo" style={matches ? styles.logo : styles.logoMobile} alt="logo" />
            }}
          </MediaQuery>
        </div>

        <LoginTabs />
        <WelcomeMessage />

        <div>
          <div>
            {this.props.isRegistered ?
              this.props.history.push('/login') :
              false}
            {
              this.props.inProgress ? <div style={styles.progress}><CircularProgress color="secondary" /></div> : ''}
            <form onSubmit={(e) => {
              e.preventDefault()
              this.formSubmit(e)
            }}>
              <FormControl
                error={this.state.emailError || (this.props.registrationError && this.props.registrationError.length) > 0 ? true : false}
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
                  placeholder={resources.EMAIL_INPUT_FORMAT_PLACEHOLDER} />
                <FormHelperText>{this.state.emailErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl
                error={this.state.passwordError ? true : false}
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
              <FormControl
                error={this.state.confirmPasswordError ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor="password">{resources.CONFIRM_PASSWORD_INPUT_LABEL}</InputLabel>
                <Input
                  type="password"
                  id="confirmpassword"
                  onBlur={(event) => this.handleConfirmPasswordBlur(event)}
                  onChange={(event) => this.handleConfirmPasswordChange(event)}
                  fullWidth
                  placeholder={resources.PASSWORD_INPUT_PLACEHOLDER} />
                <FormHelperText>{this.state.confirmPasswordErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl>
                <GoogleReCaptcha verify={this.props.verify} />
                <FormHelperText error>{this.state.captchaError && this.state.captchaErrorMessage.length > 0 ? this.state.captchaErrorMessage : ''}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormHelperText error>{this.props.registrationError && this.props.registrationError.length > 0 ? this.props.registrationError : ''}</FormHelperText>
              </FormControl>
              <Button
                type="submit"
                color="primary"
                style={styles.button}
                disabled={this.state.isButtonDisabled}
              >
                {resources.REGISTRATION_BUTTON_TEXT}</Button>
            </form>
            <OauthRow />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, match) => {
  return {
    registrationError: DMSReducers.getRegistrationError(state.dms.register),
    inProgress: DMSReducers.registrationInProgress(state.dms.register),
    isRegistered: DMSReducers.registrationIsDone(state.dms.register),
    isNotARobot: DMSReducers.captchaIsVerified(state.dms.register),
  }
}

export default withRouter(connect(mapStateToProps, {
})(Registration))
