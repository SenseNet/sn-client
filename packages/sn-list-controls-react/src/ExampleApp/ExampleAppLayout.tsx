import { AppBar, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@material-ui/core'
import { Home, List as ListIcon, Menu } from '@material-ui/icons'
import * as React from 'react'
import { Route, Switch } from 'react-router'
import { HashRouter, Link } from 'react-router-dom'
import { ContentListDemo } from './ContentListDemo'
import { WelcomePage } from './WelcomePage'

export interface ExampleAppState {
    isDrawerOpened: boolean
}

/**
 * The Example application main layout
 */
export class ExampleAppLayout extends React.Component<{}, ExampleAppState> {

    constructor(props: any) {
        super(props)
        this.closeDrawer = this.closeDrawer.bind(this)
    }

    public state: ExampleAppState = {
        isDrawerOpened: false,
    }

    public closeDrawer() {
        this.setState({ isDrawerOpened: false })
    }
    /**
     * renders the component
     */
    public render() {
        return (<HashRouter>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu">
                            <Menu onClick={() => { this.setState({ ...this.state, isDrawerOpened: !this.state.isDrawerOpened }) }} />
                        </IconButton>
                        <Typography variant="title" color="inherit">
                            list-controls-react showcase
          </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="temporary" open={this.state.isDrawerOpened} onClose={this.closeDrawer}>
                    <List>
                        <Link to="/" onClick={this.closeDrawer}>
                            <ListItem>
                                <ListItemIcon><Home /></ListItemIcon>
                                <ListItemText primary="Home" secondary="Return to the starting screen of the showcase application" />

                            </ListItem>
                        </Link>

                        <Link to="/contentlist" onClick={this.closeDrawer}>
                            <ListItem>
                                <ListItemIcon><ListIcon /></ListItemIcon>
                                <ListItemText primary="ContentList" secondary="Control for displaying a list of content" />

                            </ListItem>
                        </Link>
                    </List>
                </Drawer>
                <div className="content">
                    <Switch>
                        <Route exact path="/contentlist" component={ContentListDemo} />
                    </Switch>
                    <Switch>
                        <Route exact path="/" component={() => <WelcomePage />} />
                    </Switch>
                </div>
            </div>
        </HashRouter>)
    }
}
