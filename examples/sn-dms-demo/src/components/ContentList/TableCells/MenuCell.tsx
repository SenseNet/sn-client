import { Reducers } from '@sensenet/redux'
import MoreVert from 'material-ui-icons/MoreVert'
import IconButton from 'material-ui/IconButton'
import { TableCell } from 'material-ui/Table'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../../Actions'
import * as DMSReducers from '../../../Reducers'

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer',
    },
    icon: {
        verticalAlign: 'middle',
        opacity: 0,
    },
    selectedIcon: {
        verticalAlign: 'middle',
    },
    hoveredIcon: {
        verticalAlign: 'middle',
    },
}

interface MenuCellProps {
    content,
    actions,
    isHovered: boolean,
    isSelected: boolean,
    openActionMenu,
    closeActionMenu,
    actionMenuIsOpen: boolean,
    selectionModeOn: boolean
}
interface MenuCellState {
    anchorTop,
    anchorLeft
}

class MenuCell extends React.Component<MenuCellProps, MenuCellState> {
    public handleActionMenuClick(e, content) {
        this.props.closeActionMenu()
        this.props.openActionMenu(this.props.actions, content.Id, content.DisplayName, { top: e.currentTarget.offsetTop, left: e.currentTarget.offsetLeft - e.currentTarget.offsetWidth - 100 })
        this.setState({ anchorTop: e.clientY, anchorLeft: e.clientX })
    }
    public render() {
        const { isSelected, isHovered, content, actionMenuIsOpen, selectionModeOn } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    const padding = matches ? 'none' : 'checkbox'
                    return <TableCell style={styles.actionMenuButton}
                        padding={padding}>
                        <IconButton
                            aria-label="Menu"
                            onClick={(event) => !selectionModeOn ? this.handleActionMenuClick(event, content) : null}
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
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
})(MenuCell)
