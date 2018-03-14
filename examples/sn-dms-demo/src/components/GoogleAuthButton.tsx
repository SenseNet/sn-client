import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'

// tslint:disable-next-line:no-var-requires
const normal = require('../assets/google-signin-buttons/btn_google_signin_dark_normal_web.png')
// tslint:disable-next-line:no-var-requires
const focused = require('../assets/google-signin-buttons/btn_google_signin_dark_focus_web.png')
// tslint:disable-next-line:no-var-requires
const pressed = require('../assets/google-signin-buttons/btn_google_signin_dark_pressed_web.png')

const styles = {
    googleAuthButton: {
        cursor: 'pointer',
    },
}

enum buttonState { normal, focused, pressed }

class GoogleAuthButton extends React.Component<{ login }, { buttonImage: buttonState }> {
    constructor(props) {
        super(props)

        this.state = {
            buttonImage: normal,
        }

        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleButtonMouseOver = this.handleButtonMouseOver.bind(this)
        this.handleButtonMouseOut = this.handleButtonMouseOut.bind(this)
        this.handleButtonMouseDown = this.handleButtonMouseDown.bind(this)
        this.handleButtonMouseUp = this.handleButtonMouseUp.bind(this)
    }
    public handleButtonClick(e) {
        this.props.login()
    }
    public handleButtonMouseOver(e) {
        this.setState({
            buttonImage: focused,
        })
    }
    public handleButtonMouseOut(e) {
        this.setState({
            buttonImage: normal,
        })
    }
    public handleButtonMouseDown(e) {
        this.setState({
            buttonImage: pressed,
        })
    }
    public handleButtonMouseUp(e) {
        this.setState({
            buttonImage: normal,
        })
    }
    public render() {
        const { buttonImage } = this.state
        return (
            <img
                src={buttonImage as any}
                style={styles.googleAuthButton}
                onClick={(e) => this.handleButtonClick(e)}
                onMouseOver={(e) => this.handleButtonMouseOver(e)}
                onMouseOut={(e) => this.handleButtonMouseOut(e)}
                onMouseDown={(e) => this.handleButtonMouseDown(e)}
                onMouseUp={(e) => this.handleButtonMouseUp(e)} />
        )
    }
}

const mapStateToProps = (state, match) => {
    return {

    }
}

export default connect(mapStateToProps, {
    login: Actions.userLoginGoogle,
})(GoogleAuthButton)
