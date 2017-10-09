import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { DMSActions } from '../../Actions'

import MediaQuery from 'react-responsive';
import Table, {
    TableRow,
    TableCell
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import DisplayNameCell from './TableCells/DisplayNameCell'
import MenuCell from './TableCells/MenuCell'
import { IconCell, DateCell } from './TableCells'

const styles = {
    selectedRow: {

    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkbox: {
        opacity: 0
    },
    selectedCheckbox: {
        opacity: 1
    },
    hoveredCheckbox: {
        opacity: 1
    },
    row: {
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        KhtmlUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
        UserSelect: 'none'
    }
}

interface ISimpleTableRowProps {
    content,
    ids,
    select: Function,
    deselect: Function,
    getActions: Function,
    opened: Number,
    openActionMenu: Function,
    closeActionMenu: Function,
    history,
    parentId,
    rootId,
    selected,
    handleRowDoubleClick: Function,
    handleRowSingleClick: Function
}

interface ISimpleTableRowState {
    hovered,
    opened,
    actionMenuIsOpen,
    anchorEl,
    selected
}

class SimpleTableRow extends React.Component<ISimpleTableRowProps, ISimpleTableRowState>{
    constructor(props) {
        super(props)

        this.state = {
            selected: [],
            hovered: null,
            opened: this.props.opened,
            actionMenuIsOpen: false,
            anchorEl: null
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
    }

    handleContextMenu(e, content) {
        e.preventDefault()
        this.props.openActionMenu(content.Actions, content.Id, { top: e.clientY, left: e.clientX })
    }

    handleRowMouseEnter(e, id) {
        this.setState({
            hovered: id
        })
    }
    handleRowMouseLeave() {
        this.setState({
            hovered: null
        })
    }
    isSelected(id) {
        return this.props.selected.indexOf(id) !== -1;
    }
    isHovered(id) {
        return this.state.hovered === id
    }
    render() {
        const content = this.props.content;
        const isSelected = this.isSelected(content.Id);
        const isHovered = this.isHovered(content.Id);
        return (
            <TableRow
                hover
                //onKeyDown={event => this.handleKeyDown(event, content.Id, content._type)}
                role='checkbox'
                aria-checked={isSelected}
                tabIndex={-1}
                onMouseEnter={event => this.handleRowMouseEnter(event, content.Id)}
                onMouseLeave={event => this.handleRowMouseLeave()}
                selected={isSelected}
                style={isSelected ? { ...styles.selectedRow, ...styles.row } :
                    styles.row}
                onContextMenu={event => this.handleContextMenu(event, content)}
                id={content.Id}
            >
                <TableCell
                    checkbox
                    style={styles.checkboxButton}

                    onClick={event => this.props.handleRowSingleClick(event, content.Id)}
                    onDoubleClick={event => this.props.handleRowDoubleClick(event, content.Id, content._type)}>
                    <div style={
                        isSelected ? styles.selectedCheckbox : styles.checkbox &&
                            isHovered ? styles.hoveredCheckbox : styles.checkbox}>
                        <Checkbox
                            checked={isSelected}
                        />
                    </div>
                </TableCell>
                <IconCell
                    id={content.Id}
                    icon={content.Icon}
                    handleRowSingleClick={this.props.handleRowSingleClick}
                    handleRowDoubleClick={event => this.props.handleRowDoubleClick(event, content.Id, content._type)} />
                <DisplayNameCell
                    content={content}
                    isHovered={isHovered}
                    handleRowSingleClick={event => this.props.handleRowSingleClick(event, content.Id)}
                    handleRowDoubleClick={event => this.props.handleRowDoubleClick(event, content.Id, content._type)} />
                <MediaQuery minDeviceWidth={700}>
                    <DateCell
                        id={content.Id}
                        date={content.ModificationDate}
                        handleRowDoubleClick={this.props.handleRowDoubleClick}
                        handleRowSingleClick={this.props.handleRowSingleClick} />
                </MediaQuery>
                <MenuCell
                    content={content}
                    isHovered={isHovered}
                    isSelected={isSelected}
                    actionMenuIsOpen={this.state.actionMenuIsOpen} />
            </TableRow>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet),
        opened: Reducers.getOpenedContent(state.sensenet.children),
        ids: Reducers.getIds(state.sensenet.children)
    }
}
export default withRouter(connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    getActions: Actions.RequestContentActions,
    openActionMenu: DMSActions.OpenActionMenu,
    closeActionMenu: DMSActions.CloseActionMenu
})(SimpleTableRow))