import * as React from 'react'
import { connect } from 'react-redux'
import { Actions, Reducers } from 'sn-redux'
import { DMSActions } from '../Actions'
import { DMSReducers } from '../Reducers'
import Menu, { MenuItem } from 'material-ui/Menu';
import Icon from 'material-ui/Icon';

import { icons } from '../assets/icons'

const styles = {
    actionMenu: {
        display: 'none'
    },
    actionMenuList: {
        margin: 0,
        padding: '8px 0 8px',
        position: 'relative',
        flex: '1 1 auto'
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
        fontSize: 16,
        verticalAlign: 'middle',
        marginRight: 5
    },
    fixer: {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        zIndex: 0,
        position: 'absolute',
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
    },
    open: {
        display: 'block',
        position: 'absolute',
        zIndex: 10,
        maxHeight: 'calc(100vh - 96px)',
        WebkitOverflowScrolling: 'touch',
        minWidth: 16,
        minHeight: 16,
        transform: 'scale(1, 1)',
        transformOrigin: '0px 32px 0px',
        transition: 'opacity 267ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, transform 178ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        background: '#fff',
        boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
        borderRadius: 2
    }
}

interface IActionMenuProps {
    actions,
    id,
    isOpen,
    position,
    currentContent,
    close: Function,
    rename: Function,
    setEdited: Function
}

interface IActionMenuState {
    hovered,
    mouseIsDownOnMenu
}

class ActionMenu extends React.Component<IActionMenuProps, IActionMenuState>{
    constructor(props) {
        super(props)

        this.state = {
            hovered: '',
            mouseIsDownOnMenu: false
        }

        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
        this.handleOutsideClick = this.handleOutsideClick.bind(this)
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    }
    componentDidMount() {
        window.addEventListener('mousedown', this.handleOutsideClick, false);
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
        console.log(`${action} is clicked`)
        if (action === 'Rename') {
            this.props.setEdited(this.props.id)
        }
        this.handleActionMenuClose()
    }
    handleActionMenuClose() {
        this.props.close()
    }
    handleMouseDown(e) {
        this.setState({
            mouseIsDownOnMenu: true
        })
    }
    handleMouseUp(e) {
        this.setState({
            mouseIsDownOnMenu: false
        })
    }
    handleOutsideClick(e) {
        if (this.state.mouseIsDownOnMenu) {
            return;
        }
        if (this.props.isOpen)
            this.handleActionMenuClose()
    }
    isHovered(id) {
        return this.state.hovered === id
    }
    render() {
        const { isOpen, position, actions } = this.props
        const positionStyles = {
            positions: {
                top: position ? `${position.top}px` : 0,
                left: position ? `${position.left}px` : 0
            }
        }
        return (
            // TODO menu open animation
            <div style={isOpen ? { ...styles.open, ...positionStyles.positions as any } : styles.actionMenu}>
                <ul
                    id='actionMenu'
                    role='menu'
                    style={styles.actionMenuList as any}
                >
                    {this.props.actions.map(action => {
                        const isHovered = this.isHovered(action.Name);
                        return (
                            <li
                                key={action.Name}
                                role='menuitem'
                                style={isHovered ? { ...styles.actionMenuItem, ...styles.selectedActionMenuItem } : styles.actionMenuItem as any}
                                onMouseEnter={event => this.handleMouseEnter(event, action.Name)}
                                onMouseLeave={event => this.handleMouseLeave()}
                                onClick={event => this.handleMenuItemClick(event, action.Name)}
                                onMouseDown={event => this.handleMouseDown(event)}
                                onMouseUp={event => this.handleMouseUp(event)} >
                                <Icon color='accent' style={styles.actionIcon}>{
                                    action.Icon === 'Application' ?
                                        icons[action.Name.toLowerCase()] :
                                        icons[action.Icon.toLowerCase()]
                                }</Icon>
                                {action.DisplayName}
                                <span style={styles.fixer as any}></span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

const renameContent = Actions.UpdateContent
const setEdited = DMSActions.SetEditedContentId

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu),
        isOpen: DMSReducers.actionmenuIsOpen(state.dms.actionmenu),
        position: DMSReducers.getActionMenuPosition(state.dms.actionmenu),
        id: DMSReducers.getItemOnActionMenuIsOpen(state.dms.actionmenu)
    }
}

export default connect(mapStateToProps, {
    close: DMSActions.CloseActionMenu,
    rename: renameContent,
    setEdited: setEdited
})(ActionMenu)