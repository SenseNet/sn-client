
import * as React from 'react'
import {
    Redirect,
    withRouter
} from 'react-router-dom'
import * as keycode from 'keycode';
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import { DMSActions } from '../../Actions'
import Table, {
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import * as MoreVert from 'material-ui-icons/MoreVert';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { icons } from '../../assets/icons'
import Moment from 'react-moment';
import { ListHead } from './ListHead'
import { SharedItemsTableRow } from './SharedItemsTableRow'
import { ParentFolderTableRow } from './ParentFolderTableRow'
import ActionMenu from '../ActionMenu'

const styles = {
    selectedRow: {

    },
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    typeIcon: {
        width: 30,
        lineHeight: '9px'
    },
    loader: {
        margin: '0 auto'
    },
    displayName: {
        fontWeight: 'bold'
    },
    hoveredDisplayName: {
        fontWeight: 'bold',
        color: '#03a9f4',
        textDecoration: 'underline',
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
    table: {
        background: '#fff'
    },
    checkbox: {
        opacity: 0
    },
    selectedCheckbox: {

    },
    hoveredCheckbox: {

    }
}

interface TodoListProps {
    ids,
    children,
    currentId,
    select: Function,
    deselect: Function,
    getActions: Function,
    selected: Number[],
    opened: Number,
    actions,
    triggerActionMenu: Function,
    history,
    parentId
}

interface TodoListState {
    selected,
    ids,
    order,
    orderBy,
    data,
    hovered,
    opened,
    actionMenuIsOpen,
    anchorEl
}

class ContentList extends React.Component<TodoListProps, TodoListState> {
    constructor(props) {
        super(props)
        this.state = {
            selected: [],
            order: 'desc',
            orderBy: 'IsFolder',
            data: this.props.children,
            hovered: null,
            ids: this.props.ids,
            opened: this.props.opened,
            actionMenuIsOpen: false,
            anchorEl: null
        };

        this.isSelected = this.isSelected.bind(this);
        this.isHovered = this.isHovered.bind(this)
        this.handleContextMenu = this.handleContextMenu.bind(this)
    }
    componentDidUpdate(prevOps) {
        if (this.props.children !== prevOps.children) {
            this.setState({
                data: this.props.children
            })
        }
    }
    handleRowClick(e, id) {
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
        this.props.getActions(content, 'DMSListItem') && this.props.triggerActionMenu(e.currentTarget)
    }
    handleActionMenuClick(e, content) {
        this.props.triggerActionMenu(e.currentTarget)
        this.props.getActions(content, 'DMSListItem') && this.setState({ anchorEl: e.currentTarget })
    }
    handleActionMenuClose = (e) => {
        this.props.triggerActionMenu(e.currentTarget, false)
    };
    handleKeyDown(e, id) { }
    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        const data = this.state.data.sort(
            (a, b) => (order === 'desc' ? b[orderBy] > a[orderBy] : a[orderBy] > b[orderBy]),
        );

        this.setState({ data, order, orderBy });
    };
    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.props.ids });
            return;
        }
        this.setState({ selected: [] });
    };
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
    isSelected(id) { return this.state.selected.indexOf(id) !== -1; }
    isHovered(id) {
        return this.state.hovered === id
    }
    isOpened(id) { return this.state.opened === id }
    render() {
        return (<div>
            <Table>
            <ListHead
                numSelected={this.state.selected.length}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                count={this.props.ids.length}
            />
            <TableBody style={styles.table}>
                {this.props.currentId && this.props.currentId.length > 0}
                {this.props.currentId && this.props.currentId.length > 0 ?
                    <ParentFolderTableRow parentId={this.props.parentId} /> :
                    <SharedItemsTableRow currentId={this.props.currentId} />
                }

                {this.props.ids.map(n => {
                    //TODO: selection, action, reducer, meg minden
                    let content = this.props.children[n];
                    const isSelected = this.isSelected(content.Id);
                    const isHovered = this.isHovered(content.Id);
                    return (
                        <TableRow
                            hover
                            onKeyDown={event => this.handleKeyDown(event, content.Id)}
                            role='checkbox'
                            aria-checked={isSelected}
                            tabIndex='-1'
                            key={content.Id}
                            onMouseEnter={event => this.handleRowMouseEnter(event, content.Id)}
                            onMouseLeave={event => this.handleRowMouseLeave()}
                            selected={isSelected}
                            style={isSelected ? styles.selectedRow : null}
                            onContextMenu={event => this.handleContextMenu(event, content)}
                        >
                            <TableCell checkbox style={styles.checkboxButton}>
                                <Checkbox
                                    checked={isSelected}
                                    style={
                                        isSelected ? styles.selectedCheckbox : styles.checkbox &&
                                            isHovered ? styles.hoveredCheckbox : styles.checkbox}
                                />
                            </TableCell>
                            <TableCell
                                style={styles.typeIcon}
                                disablePadding
                                onClick={event => this.handleRowClick(event, content.Id)}
                                onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                                <Icon color='primary'>{icons[content.Icon]}</Icon>
                            </TableCell>
                            <TableCell
                                style={isHovered ? styles.hoveredDisplayName : styles.displayName}
                                onClick={event => this.handleRowClick(event, content.Id)}
                                onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                                {content.DisplayName}
                            </TableCell>
                            <TableCell
                                onClick={event => this.handleRowClick(event, content.Id)}
                                onDoubleClick={event => this.handleRowDoubleClick(event, content.Id)}>
                                <Moment fromNow>
                                    {content.ModificationDate}
                                </Moment>
                            </TableCell>
                            <TableCell style={styles.actionMenuButton}>
                                <IconButton
                                    aria-label='Menu'
                                    aria-owns={this.state.actionMenuIsOpen}
                                    onClick={event => this.handleActionMenuClick(event, content)}
                                >
                                    <MoreVert style={
                                        isHovered ? styles.hoveredIcon : styles.icon &&
                                            isSelected ? styles.selectedIcon : styles.icon
                                    } />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
            <ActionMenu
                open={this.state.actionMenuIsOpen}
                handleRequestClose={this.handleActionMenuClose}
                anchorEl={this.state.anchorEl} />
        </div>)
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet),
        ids: Reducers.getIds(state.sensenet.children),
        opened: Reducers.getOpenedContent(state.sensenet.children)
    }
}
export default withRouter(connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    getActions: Actions.RequestContentActions,
    triggerActionMenu: DMSActions.TriggerActionMenu
})(ContentList))