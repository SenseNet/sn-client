
import * as React from 'react'
import { Key } from 'ts-keycode-enum';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { DMSActions } from '../../Actions'
import { DropTarget } from 'react-dnd'
import {
    withRouter
} from 'react-router-dom'
import Table, {
    TableBody
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import { ListHead } from './ListHead'
import SimpleTableRow from './SimpleTableRow'
import { SharedItemsTableRow } from './SharedItemsTableRow'
import ParentFolderTableRow from './ParentFolderTableRow'
import ActionMenu from '../ActionMenu/ActionMenu'
import SelectionBox from '../SelectionBox'
import { DragAndDrop } from '../../DragAndDrop'

const styles = {
    paper: {
        width: '100%',
        overflow: 'hidden'
    },
    tableBody: {
        background: '#fff'
    },
    loader: {
        textAlign: 'center',
        padding: 60
    }
}

interface ContentListProps {
    ids: number[],
    children,
    currentId: number,
    selected: number[],
    selectedContentItems,
    history,
    parentId: number,
    edited: number,
    rootId: number,
    isFetching: boolean,
    isLoading: boolean,
    select: Function,
    deselect: Function,
    clearSelection: Function,
    delete: Function,
    deleteBatch: Function,
    copyBatch: Function,
    moveBatch: Function,
    selectionModeOn: Function,
    selectionModeOff: Function,
    selectionModeIsOn: boolean,
    connectDropTarget: Function,
    isOver: boolean,
    canDrop: boolean,
    onDrop: Function,
    accepts: string[],
}

interface ContentListState {
    ids,
    order,
    orderBy,
    data,
    selected,
    active,
    copy
}

@DropTarget(props => props.accepts, DragAndDrop.uploadTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
class ContentList extends React.Component<ContentListProps, ContentListState> {
    constructor(props) {
        super(props)
        this.state = {
            order: 'desc',
            orderBy: 'IsFolder',
            data: this.props.children,
            ids: this.props.ids,
            selected: [],
            active: null,
            copy: false
        };
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleTap = this.handleTap.bind(this)
    }

    componentDidUpdate(prevOps) {
        if (this.props.edited !== prevOps.edited) {
            this.setState({
                data: this.props.children
            })
        }

        if (this.props.selected.length > 0 && !prevOps.selectionModeIsOn) {
            this.props.selectionModeOn()
        }
        else if (this.props.selected.length === 0 && prevOps.selectionModeIsOn) {
            this.props.selectionModeOff()
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.ids.length !== nextProps.ids.length) {

            this.setState({
                data: nextProps.children
            })
        }
    }
    handleRowSingleClick(e, content, m) {
        const { ids, selected } = this.props;
        if (e.shiftKey) {
            e.preventDefault()
            const from = ids.indexOf(selected[selected.length - 1]);
            const till = ids.indexOf(Number(e.target.closest('tr').id));
            if (from < till)
                ids.map((elId, i) => {
                    if (i > from && i < till + 1) {
                        this.handleSimpleSelection(this.props.children[elId])
                    }
                })
            else
                for (let i = ids.length - 1; i > -1; i--) {
                    if (i < from && i > till - 1) {
                        this.handleSimpleSelection(this.props.children[ids[i]])
                    }
                }
        }
        else if (e.ctrlKey) {
            this.handleSimpleSelection(content)
        }
        else {
            e.target.getAttribute('type') !== 'checkbox' && window.innerWidth >= 700 ?
                this.handleSingleSelection(content) :
                this.handleSimpleSelection(content)
        }
    }
    handleRowDoubleClick(e, id, type) {
        if (type === 'Folder'){
            this.props.history.push(`/${id}`)
            this.props.deselect(this.props.children[id])
        }
        else
            console.log('open preview')
    }
    handleKeyDown(e) {
        const ctrl = e.ctrlKey ? true : false;
        const shift = e.shiftKey ? true : false;
        const { children, ids } = this.props

        if (ctrl)
            this.setState({
                copy: true
            })

        if (e.target.getAttribute('type') === 'text')
            return null
        else {
            const id = Number(e.target.closest('tr').id)
            if (id !== 0) {
                const type = children[id]._type
                this.setState({
                    active: id
                })
                switch (e.which) {
                    case Key.Space:
                        e.preventDefault()
                        this.handleSimpleSelection(children[id])
                        break
                    case Key.Enter:
                        e.preventDefault()
                        this.handleRowDoubleClick(e, id, type)
                        break
                    case Key.UpArrow:
                        if (shift) {
                            const upperItemIndex = ids.indexOf(Number(this.state.active)) - 1
                            upperItemIndex > -1 ?
                                this.handleSimpleSelection(children[ids[upperItemIndex]]) :
                                null
                        }
                        break
                    case Key.DownArrow:
                        if (shift) {
                            const upperItemIndex = ids.indexOf(Number(this.state.active)) + 1
                            upperItemIndex < ids.length ?
                                this.handleSimpleSelection(children[ids[upperItemIndex]]) :
                                null
                        }
                        break
                    case Key.Delete:
                        const permanent = shift ? true : false;
                        if (this.props.selected.length > 0) {
                            this.props.deleteBatch(this.props.selectedContentItems, permanent)
                            this.props.clearSelection()
                        }
                        break
                    case Key.A:
                        if (ctrl) {
                            e.preventDefault()
                            this.handleSelectAllClick(e, true)
                        }
                        break
                    default:
                        break
                }
            }
        }
    }
    handleKeyUp(e) {
        const ctrl = e.ctrlKey ? true : false;
        if (!ctrl)
            this.setState({
                copy: false
            })
    }
    handleSimpleSelection(content) {
        this.props.selected.indexOf(content.Id) > -1 ?
            this.props.deselect(content) :
            this.props.select(content)

        const { selected } = this.state;
        const selectedIndex = selected.indexOf(content.Id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, content.Id);
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

        this.setState({ selected: newSelected, active: content.Id });
    }
    handleSingleSelection(content) {
        this.props.clearSelection()
        this.props.select(content)
        this.setState({ selected: [content.Id], active: content.Id });
    }
    handleRequestSort = (event, property) => {
        // TODO: implement sorting
    };
    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.props.ids });
            this.props.ids.map(id => this.props.selected.indexOf(id) > -1 ? null : this.props.select(this.props.children[id]))
            return;
        }
        this.setState({ selected: [] });
        this.props.ids.map(id => { this.props.deselect(this.props.children[id]) })
    };
    handleTap(e, id, type) {
        if (type === 'Folder')
            this.props.history.push(`/${id}`)
        else
            console.log('open preview')
    }
    isChildrenFolder() {
        let urlArray = location.href.split('/')
        let id = parseInt(urlArray[urlArray.length - 1]);
        return !isNaN(id) && isFinite(id) && id !== this.props.rootId;
    }
    render() {
        const { connectDropTarget } = this.props
        return connectDropTarget(
            <div>
                <Paper style={styles.paper as any}>
                    <Table
                        onKeyDown={event => this.handleKeyDown(event)}
                        onKeyUp={event => this.handleKeyUp(event)}>
                        <MediaQuery minDeviceWidth={700}>
                            <ListHead
                                numSelected={this.state.selected.length}
                                order={this.state.order}
                                orderBy={this.state.orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                count={this.props.ids.length}
                            />
                        </MediaQuery>
                        <TableBody style={styles.tableBody}>
                            {this.props.parentId && this.isChildrenFolder() ?
                                <ParentFolderTableRow parentId={this.props.parentId} history={this.props.history} /> :
                                <SharedItemsTableRow currentId={this.props.currentId} />
                            }
                            {this.props.isFetching || this.props.isLoading ?
                                <tr>
                                    <td colSpan={5} style={styles.loader}>
                                        <CircularProgress color="accent" size={50} />
                                    </td>
                                </tr>
                                : this.props.ids.map(n => {
                                    let content = this.props.children[n];

                                    return typeof content !== 'undefined' ? (
                                        <SimpleTableRow
                                            content={content}
                                            key={content.Id}
                                            handleRowDoubleClick={this.handleRowDoubleClick}
                                            handleRowSingleClick={this.handleRowSingleClick}
                                            handleTap={e => this.handleTap(e, content.Id, content._type )}
                                            isCopy={this.state.copy} />
                                    ) : null
                                })
                            }

                        </TableBody>
                    </Table>
                    <ActionMenu />
                </Paper>
                <SelectionBox />
            </div>)
    }
}

const mapStateToProps = (state, match) => {
    return {
        ids: Reducers.getIds(state.sensenet.children),
        rootId: DMSReducers.getRootId(state.dms),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        selectedContentItems: Reducers.getSelectedContentItems(state.sensenet),
        isFetching: Reducers.getFetching(state.sensenet.children),
        isLoading: DMSReducers.getLoading(state.dms),
        edited: DMSReducers.getEditedItemId(state.dms),
        selectionModeIsOn: DMSReducers.getIsSelectionModeOn(state.dms)
    }
}
export default withRouter(connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    clearSelection: Actions.ClearSelection,
    delete: Actions.Delete,
    deleteBatch: Actions.DeleteBatch,
    copyBatch: Actions.CopyBatch,
    moveBatch: Actions.MoveBatch,
    selectionModeOn: DMSActions.SelectionModeOn,
    selectionModeOff: DMSActions.SelectionModeOff
})(ContentList))