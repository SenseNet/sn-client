import { Actions, Reducers } from '@sensenet/redux'
import Icon from 'material-ui/Icon'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../../Actions'
import * as DMSReducers from '../../Reducers'

import { icons } from '../../assets/icons'

const styles = {
    actionMenuList: {
        margin: 0,
        padding: '8px 0 8px',
        position: 'relative',
        flex: '1 1 auto',
        fontSize: '16px',
    },
    actionMenuItem: {
        listStyleType: 'none',
        color: 'rgba(0, 0, 0, 0.87)',
        overflow: 'hidden',
        fontSize: '13px',
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
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
    },
    selectedActionMenuItem: {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
    actionIcon: {
        marginRight: 0,
    },
    fileinput: {
        display: 'none',
    },
    uploadContainer: {
        width: '100%',
    },
    uploadLabel: {
        display: 'block',
        width: '100%',
    },
    uploadText: {
        display: 'inline-block',
        verticalAlign: 'middle',
    },
    uploadIcon: {
        verticalAlign: 'middle',
    },
}

interface ActionListProps {
    actions,
    id,
    selected,
    currentContent,
    setEdited,
    handleActionMenuClose,
    handleMouseDown,
    handleMouseUp,
    clearSelection,
    deleteBatch,
    uploadContent
}

interface ActionListState {
    hovered
}

class ActionList extends React.Component<ActionListProps, ActionListState> {
    constructor(props) {
        super(props)
        this.state = {
            hovered: '',
        }
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this)
    }
    public isHovered(id) {
        return this.state.hovered === id
    }
    public handleMouseEnter(e, name) {
        this.setState({
            hovered: name,
        })
    }
    public handleMouseLeave() {
        this.setState({
            hovered: '',
        })
    }
    public handleMenuItemClick(e, action) {
        switch (action) {
            case 'Rename':
                this.props.handleActionMenuClose()
                this.props.setEdited(this.props.id)
                break
            case 'ClearSelection':
                this.props.handleActionMenuClose()
                this.props.clearSelection()
                break
            case 'DeleteBatch':
                this.props.handleActionMenuClose()
                this.props.clearSelection()
                this.props.deleteBatch(this.props.selected, false)
                break
            default:
                console.log(`${action} is clicked`)
                this.props.handleActionMenuClose()
                break
        }
    }
    public handleFileUpload(e) {
        const fileList = e.target.files
        const files = Array.from(fileList)
        files.map((file) => {
            this.props.uploadContent(this.props.currentContent, file, undefined, undefined, null, undefined, 'DMSListItem')
        })
    }
    public render() {

        return <List
            id="actionMenu"
            role="menu"
            style={styles.actionMenuList as any}
        >
            {this.props.actions.map((action, index) => {
                const isHovered = this.isHovered(`${action.Name}-${index}`)
                let inner = null
                if (action.Name === 'Upload') {
                    inner = <div style={styles.uploadContainer}>
                        <input
                            style={styles.fileinput}
                            id="file"
                            multiple
                            type="file"
                            onChange={(event) => this.handleFileUpload(event)} />
                        <label htmlFor="file" style={styles.uploadLabel}>
                            <ListItemIcon style={{ ...styles.actionIcon, ...styles.uploadIcon }}>
                                <Icon color="secondary">{
                                    action.Icon === 'Application' ?
                                        icons[action.Name.toLowerCase()] :
                                        icons[action.Icon.toLowerCase()]
                                }</Icon>
                            </ListItemIcon>
                            <ListItemText style={styles.uploadText} primary={action.DisplayName} />
                        </label>
                    </div>
                } else {
                    inner = <ListItemText primary={action.DisplayName} />
                }
                return (
                    <ListItem
                        key={`${action.Name}-${index}`}
                        role="menuitem"
                        style={isHovered ? { ...styles.actionMenuItem, ...styles.selectedActionMenuItem } : styles.actionMenuItem as any}
                        onMouseEnter={(event) => this.handleMouseEnter(event, `${action.Name}-${index}`)}
                        onMouseLeave={(event) => this.handleMouseLeave()}
                        onClick={(event) => this.handleMenuItemClick(event, `${action.Name}-${index}`)}
                        onMouseDown={(event) => this.props.handleMouseDown(event)}
                        onMouseUp={(event) => this.props.handleMouseUp(event)} >

                        {action.Name !== 'Upload' ?
                            <ListItemIcon style={styles.actionIcon}>
                                <Icon color="secondary">{
                                    action.Icon === 'Application' ?
                                        icons[action.Name.toLowerCase()] :
                                        icons[action.Icon.toLowerCase()]
                                }</Icon>
                            </ListItemIcon> : null
                        }
                        {inner}
                    </ListItem>
                )
            })}
        </List>
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        selected: Reducers.getSelectedContentIds(state.sensenet),
    }
}

export default connect(mapStateToProps, {
    setEdited: DMSActions.setEditedContentId,
    clearSelection: Actions.clearSelection,
    deleteBatch: Actions.deleteBatch,
    uploadContent: Actions.uploadRequest,
})(ActionList)
