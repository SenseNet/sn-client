import { Reducers } from '@sensenet/redux'
import Checkbox from 'material-ui/Checkbox'
import {
    TableCell,
    TableRow,
} from 'material-ui/Table'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import {
    withRouter,
} from 'react-router-dom'
import * as DMSActions from '../../Actions'
import { IconCell } from './TableCells'
import DateCell from './TableCells/DateCell'
import DisplayNameCell from './TableCells/DisplayNameCell'
import MenuCell from './TableCells/MenuCell'

const styles = {
    selectedRow: {

    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer' as any,
    },
    checkbox: {
        opacity: 0,
    },
    selectedCheckbox: {
        opacity: 1,
    },
    hoveredCheckbox: {
        opacity: 1,
    },
    row: {
        WebkitTouchCallout: 'none'as any,
        WebkitUserSelect: 'none'as any,
        KhtmlUserSelect: 'none'as any,
        MozUserSelect: 'none'as any,
        MsUserSelect: 'none'as any,
        UserSelect: 'none'as any,
    },
}

interface SimpleTableRowProps {
    content,
    ids,
    opened: number,
    openActionMenu,
    closeActionMenu,
    history,
    parentId,
    rootId,
    selected,
    handleRowDoubleClick,
    handleRowSingleClick,
    handleTap,
    selectionModeOn,
    selectionModeOff,
    isCopy: boolean
}

interface SimpleTableRowState {
    hovered,
    opened,
    actionMenuIsOpen,
    anchorEl,
    selected
}

class SimpleTableRow extends React.Component<SimpleTableRowProps, SimpleTableRowState> {
    constructor(props) {
        super(props)

        this.state = {
            selected: [],
            hovered: null,
            opened: this.props.opened,
            actionMenuIsOpen: false,
            anchorEl: null,
        }
        this.handleContextMenu = this.handleContextMenu.bind(this)
        this.handleIconTap = this.handleIconTap.bind(this)
    }

    public handleContextMenu(e, content) {
        e.preventDefault()
        this.props.openActionMenu(content.Actions, content.Id, content.DisplayName, { top: e.clientY, left: e.clientX })
    }

    public handleRowMouseEnter(e, id) {
        this.setState({
            hovered: id,
        })
    }
    public handleRowMouseLeave() {
        this.setState({
            hovered: null,
        })
    }
    public isSelected(id) {
        return this.props.selected.indexOf(id) > -1
    }
    public isHovered(id) {
        return this.state.hovered === id
    }

    public handleIconTap(e, content) {
        this.props.handleRowSingleClick(e, content)
    }
    public render() {
        const { content, handleRowSingleClick, handleRowDoubleClick, handleTap, isCopy } = this.props
        const isSelected = this.isSelected(content.Id)
        const isHovered = this.isHovered(content.Id)
        return (
            <TableRow
                hover
                // onKeyDown={event => this.handleKeyDown(event, content.Id, content.Type)}
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
                onMouseEnter={(event) => this.handleRowMouseEnter(event, content.Id)}
                onMouseLeave={(event) => this.handleRowMouseLeave()}
                selected={isSelected}
                style={isSelected ? { ...styles.selectedRow, ...styles.row } :
                    styles.row}
                onContextMenu={(event) => this.handleContextMenu(event, content)}
                id={content.Id}
            >
                <MediaQuery minDeviceWidth={700}>
                    <TableCell
                        padding="checkbox"
                        style={styles.checkboxButton}

                        onClick={(event) => handleRowSingleClick(event, content)}
                        onDoubleClick={(event) => handleRowDoubleClick(event, content.Id, content.Type)}>
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
                            handleRowSingleClick={(event) => matches ? handleRowSingleClick(event, content) : this.handleIconTap(event, content)}
                            handleRowDoubleClick={(event) => matches ? handleRowDoubleClick(event, content.Id, content.Type) : event.preventDefault()} />
                    }}
                </MediaQuery>
                <MediaQuery minDeviceWidth={700}>
                    {(matches) => {
                        return <DisplayNameCell
                            content={content}
                            isHovered={isHovered}
                            handleRowSingleClick={(event) => matches ? handleRowSingleClick(event, content) : handleTap(event, content, content.Type)}
                            handleRowDoubleClick={(event) => matches ? handleRowDoubleClick(event, content.Id, content.Type) : event.preventDefault()}
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
        ids: Reducers.getIds(state.sensenet.children),
    }
}
export default withRouter(connect(mapStateToProps, {
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    selectionModeOn: DMSActions.selectionModeOn,
    selectionModeOff: DMSActions.selectionModeOff,
})(SimpleTableRow))
