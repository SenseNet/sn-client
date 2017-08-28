import * as React from 'react'
import LoginTabs from '../components/LoginTabs'
import { WelcomeMessage } from '../components/WelcomeMessage'
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
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
    margin: 20,
  }
}

export const Registration = ({ registration, props }) => {

  let email, password;

  function handleChange(e) {
    if (e.target.id === 'email')
      email = e.target.value
    if (e.target.id === 'password')
      password = e.target.value
  }

  function isNotValid() {
    return true
  }

  return (
    <div>
      <div className='Sensenet-header'>
        <img src={logo} className='Sensenet-logo' alt='logo' />
      </div>

      <LoginTabs />
      <WelcomeMessage />
      <div>
        <MuiThemeProvider theme={muiTheme}>
          <form onSubmit={e => {
            e.preventDefault()
            registration(email, password)
          }}>

            {/* {
        user.FieldMappings.map(function (e, i) {
          return (
            React.createElement(
              user.FieldMappings[i].ControlType,
              {
                ...user.FieldMappings[i].ClientSettings,
                'data-actionName': 'new',
                'data-fieldValue': '',
                'className': user.FieldMappings[i].ClientSettings.key
              })
          )
        })
      } */}
            <FormControl
              error={isNotValid() ? true : false}
              fullWidth
              required>
              <InputLabel htmlFor='email'>E-mail</InputLabel>
              <Input type='email' id='email' onChange={handleChange} fullWidth autoFocus placeholder='E-mail' />
              <FormHelperText>Error message! Something is not okay.</FormHelperText>
            </FormControl>
            <TextField
              id='password'
              type='password'
              label='Password'
              InputProps={{ placeholder: 'Password' }}
              fullWidth
              //error
              margin='normal'
              helperText='Error message! Something is not okay.'
              helperTextClassName='error'
              required
            />
            <Button type='submit' color='primary' style={styles.button}>Register</Button>
          </form>
        </MuiThemeProvider>
      </div>
    </div>
  )
}