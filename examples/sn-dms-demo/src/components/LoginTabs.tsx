import * as React from 'react'
import {
    Link
} from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/theme'

import blue from 'material-ui/colors/blue'
import pink from 'material-ui/colors/pink'
import createPalette from 'material-ui/styles/palette'

const muiTheme = createMuiTheme({
    palette: createPalette({
        primary: blue,
        accent: pink
    })
})

const styles = {
    tabLink: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

import { resources } from '../assets/resources'

function TabContainer(props) {
    return (
        <div style={{ padding: 20 }}>
            {props.children}
        </div>
    );
}

class LoginTabs extends React.Component<{}, { value }> {
    constructor(props) {
        super(props)
        this.state = {
            value: location.href.indexOf('login') !== -1 ? 0 : 1
        }
    }
    handleChange = (event, value) => {
        this.setState({ value });
    };
    render() {
        const { value } = this.state;
        return (
            <MuiThemeProvider theme={muiTheme}>
                <div>
                    <AppBar position='static'>
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            fullWidth
                            centered>
                            <Tab
                                key='login'
                                label={resources.LOGIN_TAB_TEXT}
                                style={styles.tabLink}
                                component={Link}
                                to='/login' />
                            <Tab
                                key='registration'
                                label={resources.REGISTER_TAB_TEXT}
                                style={styles.tabLink}
                                component={Link}
                                to='/registration' />
                        </Tabs>
                    </AppBar>
                </div>
            </MuiThemeProvider>)
    }
}

export default LoginTabs;