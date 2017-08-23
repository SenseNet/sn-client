import * as React from 'react'
import LoginTabs from '../components/LoginTabs'

const logo = require('../assets/logo.png');

export const Login = () => (
  <div>
    <div className='Sensenet-header'>
      <img src={logo} className='Sensenet-logo' alt='logo' />
    </div>

    <LoginTabs />

    <div>
      <h2>Login</h2>
    </div>
  </div>
)