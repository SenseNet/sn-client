import * as React from 'react'
import { withRouter } from 'react-router'
import {
    Link
  } from 'react-router-dom'

const styles = {
    logo: {
        flex: 1,
        color: '#fff',
        width: 40,
        textDecoration: 'none',
        fontFamily: 'roboto',
        marginLeft: 24
    },
    logoImg: {
        maxWidth: 30,
        maHeight: 30,
        verticalAlign: 'middle',
        marginRight: 10
    }
}

const sensenetLogo = require('../assets/sensenet_white.png')

const AppBarLogo = () => (
    <Link to='/' style={styles.logo} >
        <img src={sensenetLogo} alt='sensenet' aria-label='sensenet' style={styles.logoImg}  /> sensenet ECM
    </Link>
)

export default withRouter(AppBarLogo)