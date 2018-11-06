import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { ConstantContent } from '@sensenet/client-core'
import { GenericContent, IActionModel } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import { updateContent, uploadRequest } from '@sensenet/redux/dist/Actions'
import { compile } from 'path-to-regexp'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { rootStateType } from '..'
import * as DMSActions from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { icons } from '../assets/icons'
import { customSchema } from '../assets/schema'
import { ListToolbar } from '../components/ListToolbar'
import { loadMore, loadParent, select, setActive, updateChildrenOptions } from '../store/documentlibrary/actions'
import ActionMenu from './ActionMenu/ActionMenu'
import { DisplayNameCell } from './ContentList/CellTemplates/DisplayNameCell'
import { DisplayNameMobileCell } from './ContentList/CellTemplates/DisplayNameMobileCell'
import LockedCell from './ContentList/CellTemplates/LockedCell'
import { RenameCell } from './ContentList/CellTemplates/RenameCell'
import { FetchError } from './FetchError'
import { UploadBar } from './Upload/UploadBar'

// tslint:disable-next-line:variable-name
const ConnectedUploadBar = connect((state: rootStateType) => ({
    items: state.dms.uploads.uploads,
    isOpened: state.dms.uploads.showProgress,
}), {
        close: DMSActions.hideUploadProgress,
        removeItem: DMSActions.hideUploadItem,
    })(UploadBar)

const mapStateToProps = (state: rootStateType) => {
    return {
        loggedinUser: state.sensenet.session.user,
        items: state.dms.documentLibrary.items,
        errorMessage: state.dms.documentLibrary.error,
        parent: state.dms.documentLibrary.parent,
        parentIdOrPath: state.dms.documentLibrary.parentIdOrPath,
        editedItemId: state.dms.editedItemId,
        currentUser: state.sensenet.session.user,
        selected: state.dms.documentLibrary.selected,
        active: state.dms.documentLibrary.active,
        ancestors: state.dms.documentLibrary.ancestors,
        childrenOptions: state.dms.documentLibrary.childrenOptions,
        hostName: state.sensenet.session.repository.repositoryUrl,
    }
}

const mapDispatchToProps = {
    loadParent,
    loadMore,
    uploadContent: uploadRequest,
    uploadDataTransfer: DMSActions.uploadDataTransfer,
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    select,
    setActive,
    updateChildrenOptions,
    updateContent,
}

interface DocumentLibraryProps extends RouteComponentProps<any> {
    matchesDesktop
}

interface DocumentLibraryState {
    droppedFiles,
}

class DocumentLibrary extends React.Component<DocumentLibraryProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DocumentLibraryState> {
    constructor(props: DocumentLibrary['props']) {
        super(props)
        this.state = {
            droppedFiles: [],
        }

        this.handleFileDrop = this.handleFileDrop.bind(this)
        this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
    }

    private handleScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            this.props.loadMore()
        }
    }

    private static updateStoreFromPath(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        try {
            const pathFromUrl = newProps.match.params.folderPath && atob(decodeURIComponent(newProps.match.params.folderPath))
            const userProfilePath = `/Root/Profiles/Public/${newProps.loggedinUser.content.Name}/Document_Library`
            newProps.loadParent(pathFromUrl || userProfilePath)
        } catch (error) {
            /** Cannot parse current folder from URL */
            return compile(newProps.match.path)({ folderPath: '' })
        }
    }

    public static getDerivedStateFromProps(newProps: DocumentLibrary['props'], lastState: DocumentLibrary['state']) {
        if (newProps.loggedinUser.userName !== 'Visitor') {
            const newPath = DocumentLibrary.updateStoreFromPath(newProps, lastState)
            if (newPath && newPath !== newProps.match.url) {
                newProps.history.push(newPath)
            }
        }
        return {
            ...lastState,
        } as DocumentLibrary['state']
    }

    public handleFileDrop(ev: React.DragEvent) {
        const { uploadDataTransfer, parent } = this.props
        ev.preventDefault()
        uploadDataTransfer({
            binaryPropertyName: 'Binary',
            contentTypeName: 'File',
            createFolders: true,
            event: new DragEvent('drop', { dataTransfer: ev.dataTransfer }),
            overwrite: false,
            parentPath: parent.Path,
        })
    }

    public handleRowDoubleClick(e: React.MouseEvent, content: GenericContent) {
        if (content.IsFolder) {
            const newPath = compile(this.props.match.path)({ folderPath: btoa(content.Path) })
            this.props.history.push(newPath)
        } else {
            const newPath = compile(this.props.match.path)({ folderPath: this.props.match.params.folderPath || btoa(this.props.parentIdOrPath as any), otherActions: ['preview', btoa(content.Id as any)] })
            this.props.history.push(newPath)
        }
    }

    public componentDidUpdate() {
        this.handleScroll()
    }

    public componentDidMount() {
        addEventListener('scroll', this.handleScroll)
    }

    public componentWillUnmount() {
        removeEventListener('scroll', this.handleScroll)
    }

    public render() {
        if (this.props.errorMessage && this.props.errorMessage.length > 0) {
            return (
                <FetchError
                    message={this.props.errorMessage}
                    onRetry={() => {
                        // this.fetchData()
                    }}
                />
            )
        }
        const { matchesDesktop } = this.props
        return this.props.currentUser.content.Id !== ConstantContent.VISITOR_USER.Id ?
            <div onDragOver={(ev) => ev.preventDefault()} onDrop={this.handleFileDrop}>
                <ListToolbar
                    currentContent={this.props.parent}
                    selected={this.props.selected}
                    ancestors={this.props.ancestors}
                />
                <ConnectedUploadBar />
                <MuiThemeProvider theme={contentListTheme}>
                    <ContentList
                        displayRowCheckbox={matchesDesktop ? true : false}
                        schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent')}
                        selected={this.props.selected}
                        active={this.props.active}
                        items={this.props.items.d.results}
                        fieldsToDisplay={matchesDesktop ? ['DisplayName', 'Locked', 'ModificationDate', 'Owner', 'Actions'] : ['DisplayName', 'Actions']}
                        orderBy={this.props.childrenOptions.orderby[0][0] as any}
                        orderDirection={this.props.childrenOptions.orderby[0][1] as any}
                        onRequestSelectionChange={(newSelection) => this.props.select(newSelection)}
                        onRequestActiveItemChange={(active) => this.props.setActive(active)}
                        onRequestActionsMenu={(ev, content) => {
                            ev.preventDefault()
                            this.props.closeActionMenu()
                            this.props.openActionMenu(content.Actions as IActionModel[], content, '', ev.currentTarget.parentElement, { top: ev.clientY, left: ev.clientX })
                        }}
                        onItemContextMenu={(ev, content) => {
                            ev.preventDefault()
                            this.props.closeActionMenu()
                            this.props.openActionMenu(content.Actions as IActionModel[], content, '', ev.currentTarget.parentElement, { top: ev.clientY, left: ev.clientX })
                        }}
                        onRequestOrderChange={(field, direction) => {
                            this.props.updateChildrenOptions({
                                ...this.props.childrenOptions,
                                orderby: [[field, direction]],
                            })
                        }}
                        onItemClick={(ev, content) => {
                            if (ev.ctrlKey) {
                                if (this.props.selected.find((s) => s.Id === content.Id)) {
                                    this.props.select(this.props.selected.filter((s) => s.Id !== content.Id))
                                } else {
                                    this.props.select([...this.props.selected, content])
                                }
                            } else if (ev.shiftKey) {
                                const activeIndex = this.props.items.d.results.findIndex((s) => s.Id === this.props.active.Id)
                                const clickedIndex = this.props.items.d.results.findIndex((s) => s.Id === content.Id)
                                const newSelection = Array.from(new Set([...this.props.selected, ...[...this.props.items.d.results].slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1)]))
                                this.props.select(newSelection)
                            } else if (!this.props.selected.length || this.props.selected.length === 1 && this.props.selected[0].Id !== content.Id) {
                                this.props.select([content])
                            }
                        }}
                        onItemDoubleClick={this.handleRowDoubleClick}
                        fieldComponent={(props) => {
                            switch (props.field) {
                                case 'Locked':
                                    return (<LockedCell content={props.content} fieldName={props.field} />)
                                case 'DisplayName':
                                    if (this.props.editedItemId === props.content.Id) {
                                        return (<RenameCell
                                            icon={props.content.Icon}
                                            icons={icons}
                                            displayName={props.content.DisplayName}
                                            onFinish={(newName) => this.props.updateContent<GenericContent>(props.content.Id, { DisplayName: newName })}
                                        />)
                                    } else if (!matchesDesktop) {
                                        return (<DisplayNameMobileCell
                                            content={props.content}
                                            isSelected={props.isSelected}
                                            hasSelected={props.selected.length > 0}
                                            icons={icons}
                                            onActivate={(ev, content) => this.handleRowDoubleClick(ev, content)} />)
                                    } else {
                                        return (<DisplayNameCell
                                            content={props.content}
                                            isSelected={props.isSelected}
                                            icons={icons}
                                            hostName={this.props.hostName} />)
                                    }

                                default:
                                    return null
                            }
                        }}
                        icons={icons}
                    />
                    < ActionMenu id={0} />
                </MuiThemeProvider>
            </div>
            : null

    }
}

export default withRouter(connect<ReturnType<typeof mapStateToProps>, typeof mapDispatchToProps, DocumentLibraryProps>(mapStateToProps, mapDispatchToProps)(DocumentLibrary))
