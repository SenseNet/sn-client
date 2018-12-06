import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'
import { rootStateType } from '../store/rootReducer'

class GoogleReCaptcha extends React.Component<{ verify?: (response: any) => void }, { recaptchaResponse: any }> {
  constructor(props: GoogleReCaptcha['props']) {
    super(props)
  }
  public onChange(response: any) {
    this.setState({
      recaptchaResponse: response,
    })
    if (this.state.recaptchaResponse && this.props.verify) {
      this.props.verify(response)
    }
  }
  public render() {
    return (
      <ReCAPTCHA
        // tslint:disable-next-line:jsx-no-string-ref
        ref="recaptcha"
        sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ''}
        onChange={response => this.onChange(response)}
      />
    )
  }
}

const mapStateToProps = (state: rootStateType) => {
  return {
    isNotARobot: state.dms.register.captcha,
  }
}

export default connect(
  mapStateToProps,
  {},
)(GoogleReCaptcha)
