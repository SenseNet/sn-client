import * as React from 'react'

const style = {
    welcome: {
        fontSize: '13px',
        lineHeight: '20px',
        textAlign: 'left',
        margin: '20px 10px'
    }
}

import { resources } from '../assets/resources'

export const WelcomeMessage = () => (
    <p style={style.welcome}>
        {resources.WELCOME_MESSAGE}
    </p>
)