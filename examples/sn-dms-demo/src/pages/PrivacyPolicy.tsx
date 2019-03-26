import React from 'react'
import ReactMarkdown from 'react-markdown'
import content from '../assets/privacy-policy.md'

import '../assets/privacyPolicy.css'

const privacyPolicy = () => {
  return (
    <div className="privacypolicyContainer">
      <ReactMarkdown source={content} />
    </div>
  )
}

export default privacyPolicy
