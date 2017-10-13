import * as React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'sn-redux'
import { DMSActions } from '../Actions'
import { DMSReducers } from '../Reducers'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Icon from 'material-ui/Icon';

import { icons } from '../assets/icons'

const styles = {
    actionMenuList: {
        margin: 0,
        padding: '8px 0 8px',
        position: 'relative',
        flex: '1 1 auto',
        fontSize: '16px'
    },
    actionMenuItem: {
        listStyleType: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
        height: '24px',
        overflow: 'hidden',
        fontSize: '13px',
        boxSizing: 'content-box',
        background: 'none',
        lineHeight: '24px',
        fontWeight: 400,
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        padding: '8px 14px',
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'initial',
        textDecoration: 'none',
        cursor: 'pointer',
        border: 0,
        userSelect: 'none',
        outline: 'none',
        WebkitAppearance: 'none',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
    },
    selectedActionMenuItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)'
    },
    actionIcon: {
        marginRight: 0
    },
}

interface IActionListProps {
    actions,
    id,
    setEdited: Function,
    handleActionMenuClose: Function,
    handleMouseDown: Function,
    handleMouseUp: Function,
    clearSelection: Function
}

interface IActionListState {
    hovered
}

class ActionList extends React.Component<IActionListProps, IActionListState> {
    constructor(props) {
        super(props)
        this.state = {
            hovered: ''
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    }
    isHovered(id) {
        return this.state.hovered === id
    }
    handleMouseEnter(e, name) {
        this.setState({
            hovered: name
        })
    }
    handleMouseLeave() {
        this.setState({
            hovered: ''
        })
    }
    handleMenuItemClick(e, action) {
        switch (action) {
            case 'Rename':
                this.props.handleActionMenuClose()
                this.props.setEdited(this.props.id)
                break
            case 'ClearSelection':
                this.props.handleActionMenuClose()
                this.props.clearSelection()
                break
            default:
                console.log(`${action} is clicked`)
                this.props.handleActionMenuClose()
                break
        }
    }
    render() {
        return <List
            id='actionMenu'
            role='menu'
            style={styles.actionMenuList as any}
        >
            {this.props.actions.map(action => {
                const isHovered = this.isHovered(action.Name);
                return (
                    <ListItem
                        key={action.Name}
                        role='menuitem'
                        style={isHovered ? { ...styles.actionMenuItem, ...styles.selectedActionMenuItem } : styles.actionMenuItem as any}
                        onMouseEnter={event => this.handleMouseEnter(event, action.Name)}
                        onMouseLeave={event => this.handleMouseLeave()}
                        onClick={event => this.handleMenuItemClick(event, action.Name)}
                        onMouseDown={event => this.props.handleMouseDown(event)}
                        onMouseUp={event => this.props.handleMouseUp(event)} >
                        <ListItemIcon style={styles.actionIcon}>
                            <Icon color='accent'>{
                                action.Icon === 'Application' ?
                                    icons[action.Name.toLowerCase()] :
                                    icons[action.Icon.toLowerCase()]
                            }</Icon>
                        </ListItemIcon>
                        <ListItemText primary={action.DisplayName} />
                    </ListItem>
                )
            })}
        </List>
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu)
    }
}

export default connect(mapStateToProps, {
    setEdited: DMSActions.SetEditedContentId,
    clearSelection: Actions.ClearSelection
})(ActionList)