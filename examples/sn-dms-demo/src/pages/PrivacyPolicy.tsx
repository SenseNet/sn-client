import * as React from 'react'
import * as ReactMarkdown from 'react-markdown'
import '../md'

import * as content from '../assets/privacy-policy.md'

import '../assets/privacyPolicy.css'

const privacyPolicy = () => {
    return <div className="privacypolicyContainer">
        <ReactMarkdown source={content.default} />
    </div>
}

export default privacyPolicy
