import React from 'react'
import { resources } from '../assets/resources'

const style = {
  welcome: {
    fontSize: '13px',
    lineHeight: '20px',
    textAlign: 'left' as any,
    margin: '20px 10px',
  },
}

export const WelcomeMessage = () => (
  <p style={style.welcome} dangerouslySetInnerHTML={{ __html: resources.WELCOME_MESSAGE }} />
)
