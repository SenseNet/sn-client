
import * as React from 'react'
import { Key } from 'ts-keycode-enum';
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { DMSActions } from '../../Actions'
import {
    withRouter
} from 'react-router-dom'
import Table, {
    TableBody,
    TableHead,
    TableSortLabel,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { ListHead } from './ListHead'
import SimpleTableRow from './SimpleTableRow'
import { SharedItemsTableRow } from './SharedItemsTableRow'
import ParentFolderTableRow from './ParentFolderTableRow'
import ActionMenu from '../ActionMenu'

const styles = {
    paper: {
        width: '100%',
        overflowX: 'auto',
    },
    tableBody: {
        background: '#fff'
    }
}

interface ContentListProps {
    ids: number[],
    children,
    currentId: number,
    selected: number[],
    history,
    parentId: number,
    rootId: number,
    select: Function,
    deselect: Function,
    clearSelection: Function,
    delete: Function,
    deleteBatch: Function
}

interface ContentListState {
    ids,
    order,
    orderBy,
    data,
    selected,
    active
}

class ContentList extends React.Component<ContentListProps, ContentListState> {
    constructor(props) {
        super(props)
        this.state = {
            order: 'desc',
            orderBy: 'IsFolder',
            data: this.props.children,
            ids: this.props.ids,
            selected: [],
            active: null
        };
        this.handleRowSingleClick = this.handleRowSingleClick.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }
    componentDidUpdate(prevOps) {
        if (this.props.children !== prevOps.children) {
            this.setState({
                data: this.props.children
            })
        }
    }
    handleRowSingleClick(e, id) {
        const { ids, selected } = this.props;
        if (e.shiftKey) {
            e.preventDefault()
            const from = ids.indexOf(selected[selected.length - 1]);
            const till = ids.indexOf(Number(e.target.closest('tr').id));
            if (from < till)
                ids.map((elId, i) => {
                    if (i > from && i < till + 1) {
                        this.handleSimpleSelection(elId)
                    }
                })
            else
                for (let i = ids.length - 1; i > -1; i--) {
                    if (i < from && i > till - 1) {
                        this.handleSimpleSelection(ids[i])
                    }
                }
        }
        else if (e.ctrlKey) {
            this.handleSimpleSelection(id)
        }
        else {
            e.target.getAttribute('type') !== 'checkbox' ?
                this.handleSingleSelection(id) :
                this.handleSimpleSelection(id)
        }


    }
    handleRowDoubleClick(e, id, type) {
        if (type === 'Folder')
            this.props.history.push(`/${id}`)
        else
            console.log('open preview')
    }
    handleKeyDown(e) {
        if (e.target.getAttribute('type') === 'text')
            return null
        else {
            const ctrl = e.ctrlKey ? true : false;
            const alt = e.altKey ? true : false;
            const shift = e.shiftKey ? true : false;
            const id = Number(e.target.closest('tr').id)
            const type = this.state.data[id]._type
            this.setState({
                active: id
            })
            switch (e.which) {
                case Key.Space:
                    e.preventDefault()
                    this.handleRowSingleClick(e, id)
                    break
                case Key.Enter:
                    e.preventDefault()
                    console.log('dblclick')
                    this.handleRowDoubleClick(e, id, type)
                    break
                case Key.UpArrow:
                    if (shift) {
                        const upperItemIndex = this.props.ids.indexOf(Number(this.state.active)) - 1
                        upperItemIndex > -1 ?
                            this.handleRowSingleClick(e, this.props.ids[upperItemIndex]) :
                            null
                    }
                    break
                case Key.DownArrow:
                    if (shift) {
                        const upperItemIndex = this.props.ids.indexOf(Number(this.state.active)) + 1
                        upperItemIndex < this.props.ids.length ?
                            this.handleRowSingleClick(e, this.props.ids[upperItemIndex]) :
                            null
                    }
                    break
                case Key.Delete:
                    const permanent = shift ? true : false;
                    this.props.selected.length > 1 ?
                        // this.props.deleteBatch(this.props.selected, permanent) :
                        // this.props.delete(this.props.selected[0], permanent)
                        console.log('batch delete & permanently= ' + permanent) :
                        console.log('delete single element & permanently= ' + permanent)
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
    handleSimpleSelection(id) {
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

        this.setState({ selected: newSelected, active: id });
    }
    handleSingleSelection(id) {
        this.props.clearSelection()
        this.props.select(id)
        this.setState({ selected: [id], active: id });
    }
    handleRequestSort = (event, property) => {
        // const orderBy = property;
        // let order = 'desc';

        // if (this.state.orderBy === property && this.state.order === 'desc') {
        //     order = 'asc';
        // }
        // console.log(this.state.data)
        // const data = this.state.data.sort(
        //     (a, b) => (order === 'desc' ? b[orderBy] > a[orderBy] : a[orderBy] > b[orderBy]),
        // );

        // this.setState({ data, order, orderBy });
    };
    handleSelectAllClick = (event, checked) => {
        if (checked) {
            this.setState({ selected: this.props.ids });
            this.props.ids.map(id => this.props.selected.indexOf(id) > -1 ? null : this.props.select(id))
            return;
        }
        this.setState({ selected: [] });
        this.props.ids.map(id => { this.props.deselect(id) })
    };
    isChildrenFolder() {
        let urlArray = location.href.split('/')
        let id = parseInt(urlArray[urlArray.length - 1]);
        return !isNaN(id) && isFinite(id) && id !== this.props.rootId;
    }
    render() {
        return (
            <Paper style={styles.paper as any}>
                <Table
                    onKeyDown={event => this.handleKeyDown(event)}>
                    <ListHead
                        numSelected={this.state.selected.length}
                        order={this.state.order}
                        orderBy={this.state.orderBy}
                        onSelectAllClick={this.handleSelectAllClick}
                        onRequestSort={this.handleRequestSort}
                        count={this.props.ids.length}
                    />
                    <TableBody style={styles.tableBody}>
                        {this.props.parentId && this.isChildrenFolder() ?
                            <ParentFolderTableRow parentId={this.props.parentId} history={this.props.history} /> :
                            <SharedItemsTableRow currentId={this.props.currentId} />
                        }
                        {this.props.ids.map(n => {
                            let content = this.props.children[n];
                            return (
                                <SimpleTableRow
                                    content={content}
                                    key={content.Id}
                                    handleRowDoubleClick={this.handleRowDoubleClick}
                                    handleRowSingleClick={this.handleRowSingleClick} />
                            );
                        })}
                    </TableBody>
                </Table>
                <ActionMenu />
            </Paper>)
    }
}

const mapStateToProps = (state, match) => {
    return {
        ids: Reducers.getIds(state.sensenet.children),
        rootId: DMSReducers.getRootId(state),
        selected: Reducers.getSelectedContent(state.sensenet),
    }
}
export default withRouter(connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
    clearSelection: Actions.ClearSelection,
    delete: Actions.Delete,
    deleteBatch: Actions.DeleteBatch
})(ContentList))