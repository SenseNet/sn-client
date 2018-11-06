import * as React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { connect } from 'react-redux'

class GoogleReCaptcha extends React.Component<{ verify }, { recaptchaResponse }> {
    constructor(props) {
        super(props)
    }
    public onChange(response) {
        this.setState({
            recaptchaResponse: response,
        })
        if (this.state.recaptchaResponse) {
            this.props.verify(response)
        }
    }
    public render() {
        return (
            <ReCAPTCHA
                ref="recaptcha"
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ''}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        isNotARobot: state.dms.register.captcha,
    }
}

export default connect(mapStateToProps, {})(GoogleReCaptcha)
