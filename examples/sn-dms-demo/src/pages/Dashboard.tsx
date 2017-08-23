import * as React from 'react'
import {
    Route,
    Redirect
} from 'react-router-dom'

export const Dashboard = (LoginState) => (
    <Route render={props => (
        LoginState === 2 ? (
            <div>
                <h2>Dashboard</h2>
            </div>
        ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
    )} />

)