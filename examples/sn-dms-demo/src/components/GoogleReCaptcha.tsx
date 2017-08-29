import * as React from 'react'
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha'
import { DMSActions } from '../Actions'
import { DMSReducers } from '../Reducers'

class GoogleReCaptcha extends React.Component<{ verify }, { recaptchaResponse }>{
    constructor(props){
        super(props)
    }
    onChange(response) {
        this.setState({
            recaptchaResponse: response
        })
        if (this.state.recaptchaResponse)
            this.props.verify(response)
    }
    render() {
        return (
            <ReCAPTCHA
                ref='recaptcha'
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                onChange={this.onChange.bind(this)}
            />
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        isNotARobot: DMSReducers.captchaIsVerified(state.register)
    }
}

export default connect(mapStateToProps, {})(GoogleReCaptcha)