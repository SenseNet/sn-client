import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import { connect } from 'react-redux';
import { DMSReducers } from '../Reducers'
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
    fetchContent: Function,
    errorMessage: string,
    isFetching: boolean,
    currentId
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
    componentWillMount() {
        this.fetchData();
    }
    componentWillReceiveProps(nextProps) {
        let nextId = Number(nextProps.match.url.replace('/', '')) !== 0 ? Number(nextProps.match.url.replace('/', '')) : undefined
        if (typeof this.props.currentContent.Id !== 'undefined' &&
            typeof nextId !== 'undefined' &&
            nextId !== this.props.currentContent.Id) {
            this.fetchData(nextProps.currentContent.Path)
        }
    }
    fetchData(path?: string) {
        let optionObj = {
            select: this.state.select,
            orderby: this.state.orderby
        }
        const p = path && typeof path !== 'undefined' ?
            path :
            `/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`;

        this.props.fetchContent(p, optionObj);
        this.setState({
            id: this.props.currentId
        })
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
                parentId={this.props.currentContent.ParentId}
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
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: Number(match.match.url.replace('/', ''))
    }
}

export default withRouter(connect(mapStateToProps, {
    fetchContent: fetchContentAction
})(DocumentLibrary))