import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/app'
import './style.css'

console.log(`%c@sensenet app v${process.env.APP_VERSION}`, 'color: #16AAA6; border-bottom: 1px solid black')

ReactDOM.render(<App />, document.getElementById('root'))
