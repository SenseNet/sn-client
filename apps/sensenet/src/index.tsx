import React from 'react'
import { render } from 'react-dom'
import { App } from './components/app'
import 'monaco-editor/esm/vs/base/browser/ui/codicons/codicon/codicon.css'
import './style.css'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-balham.css'

render(<App />, document.getElementById('root'))
