import * as React from 'react'
import { connect } from 'react-redux'
import { TableCell } from 'material-ui/Table';
import MoreVert from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import { Actions, Reducers } from 'sn-redux'
import { DMSActions } from '../../../Actions'
import { DMSReducers } from '../../../Reducers'

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
    actionMenuIsOpen: boolean
}
interface IMenuCellState {
    anchorTop,
    anchorLeft
}

class MenuCell extends React.Component<IMenuCellProps, IMenuCellState>{
    handleActionMenuClick(e, content) {
        this.props.closeActionMenu()
        this.props.openActionMenu(this.props.actions, { top: e.currentTarget.offsetTop, left: e.currentTarget.offsetLeft - e.currentTarget.offsetWidth })
        this.setState({ anchorTop: e.clientY, anchorLeft: e.clientX })
    }
    handleActionMenuClose = (e) => {
        this.props.closeActionMenu()
    };
    render() {
        const { isSelected, isHovered, content, actionMenuIsOpen } = this.props
        return (
            <TableCell style={styles.actionMenuButton}>
                <IconButton
                    aria-label='Menu'
                    aria-owns={actionMenuIsOpen}
                    onClick={event => this.handleActionMenuClick(event, content)}
                >
                    <MoreVert style={
                        isHovered ? styles.hoveredIcon : styles.icon &&
                            isSelected ? styles.selectedIcon : styles.icon
                    } />
                </IconButton>
            </TableCell>
        )
    }
}


const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet),
        opened: Reducers.getOpenedContent(state.sensenet.children),
        actions: DMSReducers.getActionsOfAContent(state.sensenet.children.entities[match.content.Id])
    }
}
export default connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    openActionMenu: DMSActions.OpenActionMenu,
    closeActionMenu: DMSActions.CloseActionMenu
})(MenuCell)