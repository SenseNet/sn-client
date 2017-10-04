import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import * as keycode from 'keycode';
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { DMSActions } from '../../Actions'

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
}

interface ISimpleTableRowProps {
    content,
    select: Function,
    deselect: Function,
    getActions: Function,
    opened: Number,
    openActionMenu: Function,
    closeActionMenu: Function,
    history,
    parentId,
    rootId,
    selected
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
    componentDidUpdate() {
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
    }
    handleRowSingleClick(e, id) {
        this.props.selected.indexOf(id) > -1 ?
            this.props.deselect(id) :
            this.props.select(id)

        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    }
    handleRowDoubleClick(e, id) {
        this.props.history.push(`/${id}`)
    }
    handleContextMenu(e, content) {
        e.preventDefault()
        this.props.openActionMenu(content.Actions, content.Id, { top: e.clientY, left: e.clientX })
    }
    handleKeyDown(e, id) { }
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
                onKeyDown={event => this.handleKeyDown(event, content.Id)}
                role='checkbox'
                aria-checked={isSelected}
                tabIndex={-1}
                onMouseEnter={event => this.handleRowMouseEnter(event, content.Id)}
                onMouseLeave={event => this.handleRowMouseLeave()}
                selected={isSelected}
                style={isSelected ? styles.selectedRow : null}
                onContextMenu={event => this.handleContextMenu(event, content)}
            >
                <TableCell
                    checkbox
                    style={styles.checkboxButton}
                    onClick={event => this.handleRowSingleClick(event, content.Id)}
                    onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
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
                    handleRowSingleClick={this.handleRowSingleClick}
                    handleRowDoubleClick={this.handleRowDoubleClick} />
                <DisplayNameCell
                    content={content}
                    isHovered={isHovered}
                    handleRowSingleClick={event => this.handleRowSingleClick(event, content.Id)}
                    handleRowDoubleClick={event => this.handleRowDoubleClick(event, content.Id)} />
                <DateCell
                    id={content.Id}
                    date={content.ModificationDate}
                    handleRowDoubleClick={this.handleRowDoubleClick}
                    handleRowSingleClick={this.handleRowSingleClick} />
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
    }
}
export default withRouter(connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    getActions: Actions.RequestContentActions,
    openActionMenu: DMSActions.OpenActionMenu,
    closeActionMenu: DMSActions.CloseActionMenu
})(SimpleTableRow))