import { GoogleOauthProvider } from '@sensenet/authentication-google'
import { Actions } from '@sensenet/redux'
import React from 'react'
import { connect } from 'react-redux'

// tslint:disable-next-line:no-var-requires
const normal = require('../assets/google-signin-buttons/btn_google_signin_dark_normal_web.png')
// tslint:disable-next-line:no-var-requires
const focused = require('../assets/google-signin-buttons/btn_google_signin_dark_focus_web.png')
// tslint:disable-next-line:no-var-requires
const pressed = require('../assets/google-signin-buttons/btn_google_signin_dark_pressed_web.png')

const styles = {
  googleAuthButton: {
    cursor: 'pointer' as any,
  },
}

enum buttonState {
  normal,
  focused,
  pressed,
}

interface GoogleAuthButtonProps {
  oAuthProvider: GoogleOauthProvider
}

const mapDispatchToProps = {
  login: Actions.userLoginGoogle,
}

class GoogleAuthButton extends React.Component<
  GoogleAuthButtonProps & typeof mapDispatchToProps,
  { buttonImage: buttonState }
> {
  constructor(props: GoogleAuthButton['props']) {
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
  public handleButtonClick() {
    this.props.login(this.props.oAuthProvider)
  }
  public handleButtonMouseOver() {
    this.setState({
      buttonImage: focused,
    })
  }
  public handleButtonMouseOut() {
    this.setState({
      buttonImage: normal,
    })
  }
  public handleButtonMouseDown() {
    this.setState({
      buttonImage: pressed,
    })
  }
  public handleButtonMouseUp() {
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
        onClick={() => this.handleButtonClick()}
        onMouseOver={() => this.handleButtonMouseOver()}
        onMouseOut={() => this.handleButtonMouseOut()}
        onMouseDown={() => this.handleButtonMouseDown()}
        onMouseUp={() => this.handleButtonMouseUp()}
      />
    )
  }
}

const mapStateToProps = () => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GoogleAuthButton)
