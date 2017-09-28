import * as React from 'react'
import { connect } from 'react-redux'
import { TableCell } from 'material-ui/Table';
import MoreVert from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import { Actions, Reducers } from 'sn-redux'
import { DMSActions } from '../../../Actions'

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
    isHovered: boolean,
    isSelected: boolean,
    triggerActionMenu: Function,
    getActions: Function,
    actionMenuIsOpen: boolean
}
interface IMenuCellState {
    anchorEl
}

class MenuCell extends React.Component<IMenuCellProps, IMenuCellState>{
    handleActionMenuClick(e, content) {
        this.props.triggerActionMenu(e.currentTarget)
        this.props.getActions(content, 'DMSListItem') && this.setState({ anchorEl: e.currentTarget })
    }
    handleActionMenuClose = (e) => {
        this.props.triggerActionMenu(e.currentTarget, false)
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
    }
}
export default connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    getActions: Actions.RequestContentActions,
    triggerActionMenu: DMSActions.TriggerActionMenu
})(MenuCell)