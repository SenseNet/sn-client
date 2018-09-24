import AppBar from '@material-ui/core/AppBar'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Icon, iconType } from '@sensenet/icons-react'

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
                            <Icon
                                type={iconType.materialui}
                                iconName="menu"
                                onClick={() => { this.setState({ ...this.state, isDrawerOpened: !this.state.isDrawerOpened }) }} />
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
                                <ListItemIcon>
                                    <Icon
                                        type={iconType.materialui}
                                        iconName="home" />
                                </ListItemIcon>
                                <ListItemText primary="Home" secondary="Return to the starting screen of the showcase application" />

                            </ListItem>
                        </Link>

                        <Link to="/contentlist" onClick={this.closeDrawer}>
                            <ListItem>
                                <ListItemIcon><Icon
                                    type={iconType.materialui}
                                    iconName="list" /></ListItemIcon>
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
