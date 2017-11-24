import * as React from 'react'
import { connect } from 'react-redux'
import { TableCell } from 'material-ui/Table';
import MoreVert from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import { Actions, Reducers } from 'sn-redux'
import { DMSActions } from '../../../Actions'
import { DMSReducers } from '../../../Reducers'
import MediaQuery from 'react-responsive';

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    icon: {
        verticalAlign: 'middle',
        opacity: 0
    },
    selectedIcon: {
        verticalAlign: 'middle'
    },
    hoveredIcon: {
        verticalAlign: 'middle'
    },
}

interface IMenuCellProps {
    content,
    actions,
    isHovered: boolean,
    isSelected: boolean,
    openActionMenu: Function,
    closeActionMenu: Function,
    actionMenuIsOpen: boolean,
    selectionModeOn: boolean
}
interface IMenuCellState {
    anchorTop,
    anchorLeft
}

class MenuCell extends React.Component<IMenuCellProps, IMenuCellState>{
    handleActionMenuClick(e, content) {
        this.props.closeActionMenu()
        this.props.openActionMenu(this.props.actions, content.Id, content.DisplayName, { top: e.currentTarget.offsetTop, left: e.currentTarget.offsetLeft - e.currentTarget.offsetWidth - 100 })
        this.setState({ anchorTop: e.clientY, anchorLeft: e.clientX })
    }
    render() {
        const { isSelected, isHovered, content, actionMenuIsOpen, selectionModeOn } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    const padding = matches ? 'none' : 'checkbox';
                    return <TableCell style={styles.actionMenuButton}
                        padding={padding}>
                        <IconButton
                            aria-label='Menu'
                            aria-owns={actionMenuIsOpen}
                            onClick={event => !selectionModeOn ? this.handleActionMenuClick(event, content) : null}
                        >
                            <MoreVert style={
                                isHovered && !selectionModeOn ? styles.hoveredIcon : styles.icon &&
                                    isSelected && !selectionModeOn ? styles.selectedIcon : styles.icon
                            } />
                        </IconButton>
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}


const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContentIds(state.sensenet),
        opened: Reducers.getOpenedContent(state.sensenet.children),
        actions: DMSReducers.getActionsOfAContent(state.sensenet.children.entities[match.content.Id]),
        selectionModeOn: DMSReducers.getIsSelectionModeOn(state.dms),
    }
}
export default connect(mapStateToProps, {
    openActionMenu: DMSActions.OpenActionMenu,
    closeActionMenu: DMSActions.CloseActionMenu
})(MenuCell)