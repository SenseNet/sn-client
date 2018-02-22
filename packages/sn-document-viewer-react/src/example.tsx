import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { DocumentViewer } from './components/DocumentViewer'

ReactDOM.render(
    <DocumentViewer compiler="TypeScript" framework="React" />,
    document.getElementById('example'),
)
