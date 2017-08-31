import * as React from 'react'
import { connect } from 'react-redux';
import { Reducers } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import LoginTabs from '../components/LoginTabs'
import { WelcomeMessage } from '../components/WelcomeMessage'
import Button from 'material-ui/Button';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme'

const logo = require('../assets/logo.png');

import lightBlue from 'material-ui/colors/lightBlue'
import pink from 'material-ui/colors/pink'
import createPalette from 'material-ui/styles/palette'

const muiTheme = createMuiTheme({
  palette: createPalette({
    primary: lightBlue,
    accent: pink
  })
})

const styles = {
  button: {
    margin: '10px 0',
    width: '100%'
  },
  formControl: {
    marginTop: '20px 0px',
  }
}

import { resources } from '../assets/resources'

interface ILoginProps {
  login,
  params,
  loginError
}

interface ILoginState {
  email,
  password,
  emailError,
  passwordError,
  emailErrorMessage,
  passwordErrorMessage,
  formIsValid,
  isButtonDisabled
}

class Login extends React.Component<ILoginProps, ILoginState> {

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
      isButtonDisabled: false
    }

    this.handleEmailBlur = this.handleEmailBlur.bind(this);
    this.handlePasswordBlur = this.handlePasswordBlur.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.buttonIsDisabled = this.buttonIsDisabled.bind(this);
  }

  handleEmailBlur(e) {
    if (this.validateEmail(e.target.value)) {
      this.setState({
        email: e.target.value,
        emailErrorMessage: '',
        emailError: false
      })
    }
    else {
      this.setState({
        emailErrorMessage: resources.EMAIL_IS_NOT_VALID_MESSAGE,
        emailError: true
      })
    }
  }

  handlePasswordBlur(e) {
    if (e.target.value.length > 0) {
      this.setState({
        password: e.target.value,
        passwordErrorMessage: '',
        passwordError: false
      })
    }
    else {
      this.setState({
        passwordErrorMessage: resources.PASSWORD_IS_NOT_VALID_MESSAGE,
        passwordError: true
      })
    }
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    })
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    })
  }

  validateEmail(text) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
  }

  valid(e) {
    let valid = true;
    if (this.state.email === '' || !this.validateEmail(this.state.email)) {
      valid = false;
      this.setState({
        emailErrorMessage: resources.EMAIL_IS_NOT_VALID_MESSAGE,
        emailError: true
      })
    }
    if (this.state.password === '') {
      valid = false;
      this.setState({
        passwordErrorMessage: resources.PASSWORD_IS_NOT_VALID_MESSAGE,
        passwordError: true
      })
    }
    return valid;
  }

  formSubmit(e) {
    if (this.valid(e)) {
      this.props.login(this.state.email, this.state.password)
      this.setState({
        isButtonDisabled: true
      })
    }
  }

  buttonIsDisabled() {
    if (this.props.loginError && this.props.loginError.length)
      this.setState({
        isButtonDisabled: false
      })
    return this.state.isButtonDisabled;
  }

  render() {
    return (
      <div className='Sensenet'>
        <div className='Sensenet-header'>
          <img src={logo} className='Sensenet-logo' alt='logo' />
        </div>

        <LoginTabs />
        <WelcomeMessage />

        <div>
          <MuiThemeProvider theme={muiTheme}>
            <form onSubmit={e => {
              e.preventDefault()
              this.formSubmit(e)
            }}>
              <FormControl
                error={this.state.emailError || (this.props.loginError && this.props.loginError.length) > 0 ? true : false}
                fullWidth
                required
                style={styles.formControl}>
                <InputLabel htmlFor='email'>{resources.EMAIL_INPUT_LABEL}</InputLabel>
                <Input
                  id='email'
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
                <InputLabel htmlFor='password'>{resources.PASSWORD_INPUT_LABEL}</InputLabel>
                <Input
                  type='password'
                  id='password'
                  onBlur={(event) => this.handlePasswordBlur(event)}
                  onChange={(event) => this.handlePasswordChange(event)}
                  fullWidth
                  placeholder={resources.PASSWORD_INPUT_PLACEHOLDER} />
                <FormHelperText>{this.state.passwordErrorMessage}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormHelperText error>{this.props.loginError && this.props.loginError.length ? resources.WRONG_USERNAME_OR_PASSWORD : ''}</FormHelperText>
              </FormControl>
              <Button type='submit' color='primary' style={styles.button} disabled={this.state.isButtonDisabled}>{resources.LOGIN_BUTTON_TEXT}</Button>
            </form>
          </MuiThemeProvider>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, match) => {
  return {
    loginError: Reducers.getAuthenticationError(state.sensenet)
  }
}

export default connect(mapStateToProps, {})(Login)