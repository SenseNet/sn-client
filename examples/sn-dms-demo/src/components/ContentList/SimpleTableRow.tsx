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
import DateCell from './TableCells/DateCell'
import { IconCell } from './TableCells'

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
    opened: Number,
    openActionMenu: Function,
    closeActionMenu: Function,
    history,
    parentId,
    rootId,
    selected,
    handleRowDoubleClick: Function,
    handleRowSingleClick: Function,
    handleTap: Function,
    selectionModeOn: Function,
    selectionModeOff: Function,
    isCopy: boolean
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
        this.handleIconTap = this.handleIconTap.bind(this)
    }

    handleContextMenu(e, content) {
        e.preventDefault()
        this.props.openActionMenu(content.Actions, content.Id, content.DisplayName, { top: e.clientY, left: e.clientX })
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

    handleIconTap(e, id, type) {
        this.props.handleRowSingleClick(e, id)
    }
    render() {
        const { content, handleRowSingleClick, handleRowDoubleClick, handleTap, isCopy } = this.props
        const isSelected = this.isSelected(content.Id);
        const isHovered = this.isHovered(content.Id);
        return (
            <TableRow
                hover
                //onKeyDown={event => this.handleKeyDown(event, content.Id, content._type)}
                role="checkbox"
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
                <MediaQuery minDeviceWidth={700}>
                    <TableCell
                        padding="checkbox"
                        style={styles.checkboxButton}

                        onClick={event => handleRowSingleClick(event, content)}
                        onDoubleClick={event => handleRowDoubleClick(event, content.Id, content._type)}>
                        <div style={
                            isSelected ? styles.selectedCheckbox : styles.checkbox &&
                                isHovered ? styles.hoveredCheckbox : styles.checkbox}>
                            <Checkbox
                                checked={isSelected}
                            />
                        </div>
                    </TableCell>
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        return <IconCell
                            id={content.Id}
                            icon={content.Icon}
                            selected={isSelected}
                            handleRowSingleClick={event => matches ? handleRowSingleClick(event, content) : this.handleIconTap(event, content.Id, content._type)}
                            handleRowDoubleClick={event => matches ? handleRowDoubleClick(event, content.Id, content._type) : event.preventDefault()} />
                    }}
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        return <DisplayNameCell
                            content={content}
                            isHovered={isHovered}
                            handleRowSingleClick={event => matches ? handleRowSingleClick(event, content) : handleTap(event, content, content._type)}
                            handleRowDoubleClick={event => matches ? handleRowDoubleClick(event, content.Id, content._type) : event.preventDefault()}
                            isCopy={isCopy} />
                    }}
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    <DateCell
                        content={content}
                        date={content.ModificationDate}
                        handleRowDoubleClick={this.props.handleRowDoubleClick}
                        handleRowSingleClick={this.props.handleRowSingleClick}
                        isCopy={isCopy} />
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        return <MenuCell
                            content={content}
                            isHovered={matches ? isHovered : true}
                            isSelected={isSelected}
                            actionMenuIsOpen={this.state.actionMenuIsOpen} />
                    }}
                </MediaQuery>
            </TableRow>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContentIds(state.sensenet),
        opened: Reducers.getOpenedContent(state.sensenet.children),
        ids: Reducers.getIds(state.sensenet.children)
    }
}
export default withRouter(connect(mapStateToProps, {
    openActionMenu: DMSActions.OpenActionMenu,
    closeActionMenu: DMSActions.CloseActionMenu,
    selectionModeOn: DMSActions.SelectionModeOn,
    selectionModeOff: DMSActions.SelectionModeOff
})(SimpleTableRow))