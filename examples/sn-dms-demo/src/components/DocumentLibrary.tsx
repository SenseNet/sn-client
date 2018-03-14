import { Actions, Reducers } from '@sensenet/redux'
import * as React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import {
    withRouter,
} from 'react-router-dom'
import * as DMSActions from '../Actions'
import * as DMSReducers from '../Reducers'
import ContentList from './ContentList/ContentList'
import { FetchError } from './FetchError'

interface DocumentLibraryProps {
    currentContent,
    path,
    children,
    ids,
    loggedinUser,
    fetchContent,
    errorMessage: string,
    currentId,
    cId,
    setCurrentId,
    uploadContent
}

interface DocumentLibraryState {
    select, id, orderby, filter, expand, scenario, droppedFiles, children
}

@DragDropContext(HTML5Backend)
class DocumentLibrary extends React.Component<DocumentLibraryProps, DocumentLibraryState> {
    constructor(props) {
        super(props)
        this.state = {
            select: ['Id', 'Path', 'DisplayName', 'ModificationDate', 'Type', 'Icon', 'IsFolder', 'Actions'],
            expand: ['Actions'],
            orderby: ['IsFolder desc', 'DisplayName asc'],
            filter: 'ContentType ne \'SystemFolder\'',
            scenario: 'DMSListItem',
            id: this.props.currentContent.Id,
            droppedFiles: [],
            children: this.props.children,
        }
        this.handleFileDrop = this.handleFileDrop.bind(this)
    }
    public componentDidMount() {
        if (!this.props.cId) {
            if (this.props.loggedinUser.userName !== 'Visitor') {
                this.fetchData(undefined, this.props.loggedinUser.userName)
            }
        }
    }
    public componentWillReceiveProps(nextProps) {
        const nextId = Number(nextProps.match.params.id) !== 0 ? Number(nextProps.match.params.id) : undefined
        if (
            this.props.cId &&
            !isNaN(nextId) &&
            this.props.currentContent.Path !== nextProps.currentContent.Path
        ) {
            this.fetchData(nextProps.currentContent.Path, nextProps.loggedinUser.userName)
            this.props.setCurrentId(nextId)
        }
        if (nextProps.loggedinUser.userName !== this.props.loggedinUser.userName) {
            this.fetchData(nextProps.currentContent.Path, nextProps.loggedinUser.userName)
        }
    }
    public fetchData(path?: string, username?: string) {
        const optionObj = {
            select: this.state.select,
            expand: this.state.expand,
            orderby: this.state.orderby,
            filter: this.state.filter,
            scenario: this.state.scenario,
        }
        const p = path && typeof path !== 'undefined' ?
            path :
            `/Root/Profiles/Public/${username}/Document_Library`

        this.props.fetchContent(p, optionObj)
        this.setState({
            id: this.props.cId,
            children: this.props.children,
        })
    }
    public handleFileDrop(item, monitor) {
        const { uploadContent, currentContent } = this.props
        if (monitor) {
            const droppedFiles = monitor.getItem().files
            droppedFiles.map((file) => {
                uploadContent(currentContent.Path, file, 'File', undefined, null, undefined)
            })

            this.setState({ droppedFiles })
        }
    }
    public render() {
        const { FILE } = NativeTypes
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

const fetchContentAction = Actions.requestContent
const uploadContentAction = Actions.uploadRequest

const mapStateToProps = (state, match) => {
    return {
        loggedinUser: DMSReducers.getAuthenticatedUser(state.sensenet),
        path: DMSReducers.getCurrentContentPath(state.sensenet.currentcontent),
        children: DMSReducers.getChildrenItems(state.sensenet),
        ids: Reducers.getIds(state.sensenet.children),
        errorMessage: Reducers.getError(state.sensenet.children),
        currentContent: Reducers.getCurrentContent(state.sensenet),
        currentId: Number(match.match.url.replace('/', '')),
        cId: DMSReducers.getCurrentId(state.dms),
    }
}

export default withRouter(connect(mapStateToProps, {
    fetchContent: fetchContentAction,
    setCurrentId: DMSActions.setCurrentId,
    uploadContent: uploadContentAction,
})(DocumentLibrary))
