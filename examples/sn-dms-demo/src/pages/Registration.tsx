import * as React from 'react'
import LoginTabs from '../components/LoginTabs'

const logo = require('../assets/logo.png');

export const Registration = () => (
  <div>
    <div className='Sensenet-header'>
      <img src={logo} className='Sensenet-logo' alt='logo' />
    </div>

    <LoginTabs />

    <div>
      <h2>Registration</h2>
    </div>
  </div>
)