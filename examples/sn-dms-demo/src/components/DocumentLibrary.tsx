import * as React from 'react'
import { connect } from 'react-redux';
import { Content } from 'sn-client-js'
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import { Actions, Reducers } from 'sn-redux'
import { FetchError } from './FetchError'
import ContentList from './ContentList/ContentList'
import { CircularProgress } from 'material-ui/Progress';

const styles = {
    actionMenuButton: {
        width: 30,
        cursor: 'pointer'
    },
    checkboxButton: {
        width: 30,
        cursor: 'pointer'
    },
    loader: {
        margin: '0 auto'
    }
}

interface IDocumentLibraryProps {
    currentContent,
    path,
    children,
    ids,
    loggedinUser,
    loadContent: Function,
    fetchContent: Function,
    errorMessage: string,
    isFetching: boolean,
    parentId
}

class DocumentLibrary extends React.Component<IDocumentLibraryProps, { select, id, orderby }>{
    constructor(props) {
        super(props)
        this.state = {
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder'],
            orderby: ['IsFolder desc', 'DisplayName asc'],
            id: this.props.currentContent.Id
        }
    }
    componentDidMount() {
        if (this.props.loggedinUser.userName !== 'Visitor' && this.props.currentContent.Id === 'undefined') {
            this.fetchData();
        }
    }
    componentDidUpdate(prevOps) {
        console.log(prevOps)
        if (this.props.loggedinUser.userName !== prevOps.loggedinUser.userName) {
            this.fetchData()
        }
        if (typeof this.props.currentContent.Id !== 'undefined' &&
            typeof prevOps.currentContent.Id !== 'undefined' &&
            this.props.currentContent.Id !== prevOps.currentContent.Id) {
            this.fetchData(this.props.currentContent.Id)
        }
    }
    fetchData(id?: number) {
        let optionObj = {
            select: this.state.select,
            orderby: this.state.orderby
        }
        const path = id && typeof id !== 'undefined' ?
            `${this.props.currentContent.Path}` :
            `/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`;
        this.props.fetchContent(path, optionObj);
        this.setState({
            id: this.props.currentContent.Id
        })
    }
    loadData(id?: number) {
        let parentoptionObj = {
            select: ['Id', 'Path', 'Name', 'DisplayName', 'Type', 'Icon', 'ParentId']
        }
        const path = id && typeof id !== 'undefined' ?
            `${this.props.currentContent.Path}` :
            `/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`;

        this.props.loadContent(typeof id !== 'undefined' ? id : path, parentoptionObj)
    }

    render() {
        if (this.props.isFetching && this.props.children.length > 0) {
            return (
                <div style={styles.loader}>
                    <CircularProgress color='accent' size={50} />
                </div>
            )
        }
        if (this.props.errorMessage && this.props.errorMessage.length > 0) {
            return (
                <FetchError
                    message={this.props.errorMessage}
                    onRetry={() => this.fetchData()}
                />
            )
        }
        if (this.props.loggedinUser.userName !== 'Visitor') {
            return <ContentList
                children={this.props.children}
                currentId={this.props.currentContent.Id}
                parentId={() => this.props.currentContent.ParentId}
            />
        }
        return <div></div>
    }
}

const loadContentAction = Actions.LoadContent;
const fetchContentAction = Actions.RequestContent;

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        path: DMSReducers.getCurrentContentPath(state.sensenet.currentcontent),
        children: DMSReducers.getChildrenItems(state.sensenet),
        ids: Reducers.getIds(state.sensenet.children),
        errorMessage: Reducers.getError(state.sensenet.children),
        isFetching: Reducers.getFetching(state.sensenet.children),
        currentContent: Reducers.getCurrentContent(state.sensenet)
    }
}

export default connect(mapStateToProps, {
    loadContent: loadContentAction,
    fetchContent: fetchContentAction
})(DocumentLibrary)