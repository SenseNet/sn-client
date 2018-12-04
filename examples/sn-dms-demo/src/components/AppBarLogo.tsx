import * as React from 'react'
import MediaQuery from 'react-responsive'
import {
    Link,
} from 'react-router-dom'

const styles = {
    logo: {
        display: 'flex',
        alignItems: 'center',
        color: '#000',
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
        maxWidth: 48,
        maxHeight: 48,
        verticalAlign: 'middle' as any,
        marginRight: 5,
    },
    logoImgMobile: {
        maxWidth: 25,
        maxHeight: 25,
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
const sensenetLogo = require('../assets/logo.png')

const appBarLogo = (props: { style?: React.CSSProperties }) => (
    <MediaQuery minDeviceWidth={700}>
        {(matches) => {
            return <Link to="/documents" style={{ ...matches ? styles.logo : styles.logoMobile as any, ...props.style }} >
                <img src={sensenetLogo} alt="sensenet" aria-label="sensenet" style={matches ? styles.logoImg : styles.logoImgMobile} />
                <span style={matches ? styles.logoText : styles.logoTextMobile}>
                    <span style={styles.logoSpan}>sense</span>net
                        </span>
            </Link>
        }}
    </MediaQuery>

)

export default appBarLogo
