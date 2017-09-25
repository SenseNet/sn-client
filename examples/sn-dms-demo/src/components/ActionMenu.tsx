import * as React from 'react'
import { connect } from 'react-redux'
import { Reducers } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import Menu, { MenuItem } from 'material-ui/Menu';
import Icon from 'material-ui/Icon';

import { icons } from '../assets/icons'

const styles = {
    actionMenuItem: {
        lineHeight: '26px'
    },
    actionIcon: { 
        fontSize: 20 ,
        verticalAlign: 'middle',
        marginRight: 5
    }
}

interface IActionMenuProps {
    actions,
    handleRequestClose,
    open,
    anchorElement
}

class ActionMenu extends React.Component<IActionMenuProps, { open }>{
    constructor(props) {
        super(props)
        this.state = {
            open: this.props.open
        }
    }
    render() {
        return (
            <div>
                <Menu
                    id='actionMenu'
                    anchorEl={this.props.anchorElement}
                    open={this.props.open}
                    onRequestClose={this.props.handleRequestClose}
                >
                    {this.props.actions.map(action => {
                        return (
                            <MenuItem
                                key={action.Name}
                                onClick={this.props.handleRequestClose}
                                style={styles.actionMenuItem}>
                                <Icon color='accent' style={styles.actionIcon}>{icons[action.Icon]}</Icon>
                                {action.DisplayName}
                            </MenuItem>
                        )
                    })}
                </Menu>
            </div>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: Reducers.getChildrenActions(state.sensenet.children),
        open: DMSReducers.actionmenuIsOpen(state.actionmenu),
        anchorElement: DMSReducers.getActionMenuAnchor(state.actionmenu)
    }
}

export default connect(mapStateToProps, {})(ActionMenu)