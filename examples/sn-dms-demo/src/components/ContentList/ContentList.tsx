
import * as React from 'react'
import * as keycode from 'keycode';
import { connect } from 'react-redux';
import { Actions, Reducers } from 'sn-redux'
import { DMSReducers } from '../../Reducers'
import { DMSActions } from '../../Actions'
import Table, {
    TableBody,
    TableHead,
    TableSortLabel,
} from 'material-ui/Table';
import { ListHead } from './ListHead'
import SimpleTableRow from './SimpleTableRow'
import { SharedItemsTableRow } from './SharedItemsTableRow'
import ParentFolderTableRow from './ParentFolderTableRow'
import ActionMenu from '../ActionMenu'

const styles = {
    loader: {
        margin: '0 auto'
    },
    table: {
        background: '#fff'
    },
}

interface ContentListProps {
    ids,
    children,
    currentId,
    selected: Number[],
    history,
    parentId,
    rootId,
    select: Function,
    deselect: Function,
}

interface ContentListState {
    ids,
    order,
    orderBy,
    data,
    selected
}

class ContentList extends React.Component<ContentListProps, ContentListState> {
    constructor(props) {
        super(props)
        this.state = {
            order: 'desc',
            orderBy: 'IsFolder',
            data: this.props.children,
            ids: this.props.ids,
            selected: []
        };
    }
    componentDidUpdate(prevOps) {
        if (this.props.children !== prevOps.children) {
            this.setState({
                data: this.props.children
            })
        }
    }
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
            this.props.ids.map(id => this.props.select(id))
            return;
        }
        this.setState({ selected: [] });
        this.props.ids.map(id => this.props.deselect(id))
    };
    isChildrenFolder() {
        let urlArray = location.href.split('/')
        let id = parseInt(urlArray[urlArray.length - 1]);
        return !isNaN(id) && isFinite(id) && id !== this.props.rootId;
    }
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
                    {this.props.parentId && this.isChildrenFolder() ?
                        <ParentFolderTableRow parentId={this.props.parentId} history={this.props.history} /> :
                        <SharedItemsTableRow currentId={this.props.currentId} />
                    }

                    {this.props.ids.map(n => {
                        let content = this.props.children[n];
                        return (
                            <SimpleTableRow content={content} key={content.Id} />
                        );
                    })}
                </TableBody>
            </Table>
            {/* <ActionMenu
                open={this.state.actionMenuIsOpen}
                handleRequestClose={this.handleActionMenuClose}
                anchorEl={this.state.anchorEl} /> */}
        </div>)
    }
}

const mapStateToProps = (state, match) => {
    return {
        ids: Reducers.getIds(state.sensenet.children),
        rootId: DMSReducers.getRootId(state),
        selected: Reducers.getSelectedContent(state.sensenet)
    }
}
export default connect(mapStateToProps, {
    select: Actions.SelectContent,
    deselect: Actions.DeSelectContent,
})(ContentList)