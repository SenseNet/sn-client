import React from 'react'
import MediaQuery from 'react-responsive'
import Button from '@material-ui/core/Button'
import logo from '../assets/logo.png'
import { resources } from '../assets/resources'
import { WelcomeMessage } from '../components/WelcomeMessage'
import { userManager } from '../userManager'

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

export function Login() {
  return (
    <div className="Sensenet">
      <div className="Sensenet-header">
        <MediaQuery minDeviceWidth={700}>
          {(matches) => {
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

      <WelcomeMessage />

      <div>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            userManager.signinRedirect()
          }}
          variant="contained"
          color="primary"
          style={styles.button}>
          {resources.LOGIN_BUTTON_TEXT}
        </Button>
      </div>
    </div>
  )
}

export default Login
