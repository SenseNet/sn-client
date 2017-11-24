import * as React from 'react'
import {
    withRouter
} from 'react-router-dom'
import { connect } from 'react-redux';
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import { Content, ContentTypes } from 'sn-client-js'
import { Actions, Reducers } from 'sn-redux'
import { FetchError } from './FetchError'
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import ContentList from './ContentList/ContentList'

interface IDocumentLibraryProps {
    currentContent,
    path,
    children,
    ids,
    loggedinUser,
    fetchContent: Function,
    errorMessage: string,
    currentId,
    cId,
    setCurrentId: Function,
    uploadContent: Function
}

interface IDocumentLibraryState {
    select, id, orderby, filter, expand, scenario, droppedFiles
}

@DragDropContext(HTML5Backend)
class DocumentLibrary extends React.Component<IDocumentLibraryProps, IDocumentLibraryState>{
    constructor(props) {
        super(props)
        this.state = {
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions'],
            expand: ['Actions'],
            orderby: ['IsFolder desc', 'DisplayName asc'],
            filter: "ContentType ne 'SystemFolder'",
            scenario: 'DMSListItem',
            id: this.props.currentContent.Id,
            droppedFiles: []
        }
        this.handleFileDrop = this.handleFileDrop.bind(this)
    }
    componentDidMount() {
        if (!this.props.cId)
            this.fetchData();
    }
    componentWillReceiveProps(nextProps) {
        let nextId = Number(nextProps.match.params.id) !== 0 ? Number(nextProps.match.params.id) : undefined
        if (
            this.props.cId &&
            !isNaN(nextId) &&
            this.props.currentContent.Path !== nextProps.currentContent.Path
        ) {
            this.fetchData(nextProps.currentContent.Path)
            this.props.setCurrentId(nextId)
        }
    }
    fetchData(path?: string) {
        let optionObj = {
            select: this.state.select,
            expand: this.state.expand,
            orderby: this.state.orderby,
            filter: this.state.filter,
            scenario: this.state.scenario
        }
        const p = path && typeof path !== 'undefined' ?
            path :
            `/Root/Profiles/Public/${this.props.loggedinUser.userName}/Document_Library`;

        this.props.fetchContent(p, optionObj);
        this.setState({
            id: this.props.cId
        })
    }
    handleFileDrop(item, monitor) {
        const content: Content = this.props.currentContent
        const { uploadContent } = this.props
        if (monitor) {
            const droppedFiles = monitor.getItem().files

            droppedFiles.map(file => {
               uploadContent(content, file, undefined, undefined, null, undefined, 'DMSListItem')
            })

            this.setState({ droppedFiles })
        }
    }
    render() {
        const { FILE } = NativeTypes
        const { droppedFiles } = this.state
        if (this.props.errorMessage && this.props.errorMessage.length > 0) {
            return (
                <FetchError
                    message={this.props.errorMessage}
                    onRetry={() => this.fetchData()}
                />
            )
        }
        return <div>
            <ContentList
                children={this.props.children}
                currentId={this.props.currentContent.Id}
                parentId={this.props.currentContent.ParentId}
                accepts={[FILE]}
                onDrop={this.handleFileDrop}
            />
        </div>
    }
}

const loadContentAction = Actions.LoadContent;
const fetchContentAction = Actions.RequestContent;
const uploadContentAction = Actions.UploadRequest

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        path: DMSReducers.getCurrentContentPath(state.sensenet.currentcontent),
        children: DMSReducers.getChildrenItems(state.sensenet),
        ids: Reducers.getIds(state.sensenet.children),
        errorMessage: Reducers.getError(state.sensenet.children),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: Number(match.match.url.replace('/', '')),
        cId: DMSReducers.getCurrentId(state.dms)
    }
}

export default withRouter(connect(mapStateToProps, {
    fetchContent: fetchContentAction,
    setCurrentId: DMSActions.SetCurrentId,
    uploadContent: uploadContentAction
})(DocumentLibrary))