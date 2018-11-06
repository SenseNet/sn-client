import * as React from 'react'
import MediaQuery from 'react-responsive'
import {
    Link,
} from 'react-router-dom'

const styles = {
    logo: {
        flex: 1,
        color: '#fff',
        width: 40,
        textDecoration: 'none' as any,
        fontFamily: 'Raleway Regular',
    },
    logoSpan: {
        fontFamily: 'Raleway Regular',
        fontWeight: '600' as any,
    },
    logoMobile: {
        flex: 1,
        color: '#fff',
        textDecoration: 'none' as any,
        fontFamily: 'Raleway Regular',
        textAlign: 'center',
    },
    logoImg: {
        maxWidth: 25,
        maxHeight: 25,
        verticalAlign: 'middle' as any,
        marginRight: 5,
    },
    logoImgMobile: {
        maxWidth: 20,
        maxHeight: 20,
        verticalAlign: 'middle' as any,
        marginRight: 5,
    },
    logoText: {
        display: 'inline-block' as any,
        verticalAlign: 'middle' as any,
    },
    logoTextMobile: {
        fontSize: 14,
    },
}

// tslint:disable-next-line:no-var-requires
const sensenetLogo = require('../assets/sensenet_white.png')

const appBarLogo = () => (
    <MediaQuery minDeviceWidth={700}>
        {(matches) => {
            return <Link to="/" style={matches ? styles.logo : styles.logoMobile as any} >
                <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={matches ? styles.logoImg : styles.logoImgMobile} />
                <span style={matches ? styles.logoText : styles.logoTextMobile}>
                    <span style={styles.logoSpan}>sense</span>net
                        </span>
            </Link>
        }}
    </MediaQuery>

)

export default appBarLogo
