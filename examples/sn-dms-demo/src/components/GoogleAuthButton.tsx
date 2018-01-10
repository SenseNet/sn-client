import * as React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'sn-redux'

const normal = require('../assets/google-signin-buttons/btn_google_signin_dark_normal_web.png');
const focused = require('../assets/google-signin-buttons/btn_google_signin_dark_focus_web.png');
const pressed = require('../assets/google-signin-buttons/btn_google_signin_dark_pressed_web.png');

const styles = {
    googleAuthButton: {
        cursor: 'pointer'
    }
}

enum buttonState { normal, focused, pressed }

class GoogleAuthButton extends React.Component<{ login: Function }, { buttonImage: buttonState }>{
    constructor(props) {
        super(props)

        this.state = {
            buttonImage: normal
        }

        this.handleButtonClick = this.handleButtonClick.bind(this)
        this.handleButtonMouseOver = this.handleButtonMouseOver.bind(this)
        this.handleButtonMouseOut = this.handleButtonMouseOut.bind(this)
        this.handleButtonMouseDown = this.handleButtonMouseDown.bind(this)
        this.handleButtonMouseUp = this.handleButtonMouseUp.bind(this)
    }
    handleButtonClick(e) {
        this.props.login()
    }
    handleButtonMouseOver(e) {
        this.setState({
            buttonImage: focused
        })
    }
    handleButtonMouseOut(e) {
        this.setState({
            buttonImage: normal
        })
    }
    handleButtonMouseDown(e) {
        this.setState({
            buttonImage: pressed
        })
    }
    handleButtonMouseUp(e) {
        this.setState({
            buttonImage: normal
        })
    }
    render() {
        const { buttonImage } = this.state;
        return (
            <img
                src={buttonImage as any}
                style={styles.googleAuthButton}
                onClick={e => this.handleButtonClick(e)}
                onMouseOver={e => this.handleButtonMouseOver(e)}
                onMouseOut={e => this.handleButtonMouseOut(e)}
                onMouseDown={e => this.handleButtonMouseDown(e)}
                onMouseUp={e => this.handleButtonMouseUp(e)} />
        )
    }
}

const mapStateToProps = (state, match) => {
    return {

    }
}

export default connect(mapStateToProps, {
    login: Actions.UserLoginGoogle
})(GoogleAuthButton)