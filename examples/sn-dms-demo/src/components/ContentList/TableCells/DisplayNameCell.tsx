import * as React from 'react'
import { connect } from 'react-redux'
import { Actions, Reducers } from 'sn-redux'
import MediaQuery from 'react-responsive';
import { DMSReducers } from '../../../Reducers'
import { DMSActions } from '../../../Actions'
import { TableCell } from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import { DragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd'
import { DragAndDrop } from '../../../DragAndDrop'

const styles = {
    displayName: {
        fontWeight: 'bold',
    },
    hoveredDisplayName: {
        fontWeight: 'bold',
        color: '#03a9f4',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    displayNameDiv: {
        padding: '16px 24px'
    },
    editedTitle: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    },
}

interface IDisplayNameCellProps {
    content,
    isHovered: boolean,
    handleRowDoubleClick: Function,
    handleRowSingleClick: Function,
    rename: Function,
    setEdited: Function,
    currentContent,
    edited,
    connectDragSource: Function,
    connectDropTarget: Function,
    isDragging: boolean,
    isOver: boolean,
    canDrop: boolean,
    onDrop: Function,
    moveCard: Function,
    isCopy: boolean,
    selected,
    selectedContentItems,
    copyBatch: Function,
    moveBatch: Function,
    editedFirst: boolean,
    setEditedFirst: Function
}

interface IDisplayNameCellState {
    oldText,
    newText,
    edited,
    displayName
}

@DropTarget('row', DragAndDrop.rowTarget, (conn, monitor) => ({
    connectDropTarget: conn.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
}))
@DragSource('row', DragAndDrop.rowSource, DragAndDrop.collect)
class DisplayNameCell extends React.Component<IDisplayNameCellProps, IDisplayNameCellState>{
    private input: HTMLInputElement;
    constructor(props) {
        super(props)

        this.state = {
            oldText: this.props.content.DisplayName,
            newText: '',
            edited: this.props.edited,
            displayName: this.props.content.DisplayName
        }

        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
    }
    handleTitleClick(e, id) {
        if (e.target.id !== 'renameInput') {
            e.preventDefault()
        }
    }
    handleTitleChange(e) {
        this.setState({
            newText: e.target.value
        })
    }
    handleTitleInputBlur(id, mobile) {
        if (!mobile) {
            if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
                this.updateDisplayName()
            }
            else {
                this.setState({
                    edited: null,
                    newText: ''
                })
                this.props.setEdited(null)
            }
        }
        else {
            if (this.props.editedFirst) {
                this.input.focus();
                this.props.setEditedFirst(false)
            }
            else {
                if (this.state.newText !== '' && this.state.oldText !== this.state.newText) {
                    this.updateDisplayName()
                }
                else {
                    this.setState({
                        edited: null,
                        newText: ''
                    })
                    this.props.setEdited(null)
                }
            }
        }
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.updateDisplayName()
        }
    }
    updateDisplayName() {
        let c = this.props.currentContent;
        let updateableContent = c
        updateableContent.DisplayName = this.state.newText
        this.props.rename(updateableContent)
        this.setState({
            edited: null,
            newText: '',
            displayName: this.state.newText
        })
        this.props.setEdited(null)
    }
    isEdited(id) { return this.props.edited === id }
    render() {
        const content = this.props.currentContent
        const isEdited = this.isEdited(this.props.content.Id);
        const { handleRowSingleClick, handleRowDoubleClick, connectDragSource, connectDropTarget, isCopy } = this.props
        const dropEffect = isCopy ? 'copy' : 'move'
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                    return <TableCell
                        padding="none"
                        style={this.props.isHovered && !isEdited ? styles.hoveredDisplayName : styles.displayName as any}
                        onClick={event => handleRowSingleClick(event, content.id)}
                        onDoubleClick={event => handleRowDoubleClick(event, this.props.content.Id)}>
                        {isEdited ?
                            <TextField
                                id="renameInput"
                                autoFocus={isEdited}
                                defaultValue={this.props.content.DisplayName}
                                margin="dense"
                                style={styles.editedTitle as any}
                                onChange={event => this.handleTitleChange(event)}
                                onKeyPress={event => this.handleKeyPress(event)}
                                onBlur={event => this.handleTitleInputBlur(this.props.content.Id, !matches)}
                                inputRef={(ref) => this.input = ref}
                            /> :
                            connectDragSource(connectDropTarget(<div
                                onClick={event => matches ? this.handleTitleClick(event, this.props.content.Id) : event.preventDefault()}
                                style={styles.displayNameDiv}>{this.state.displayName}</div>), { dropEffect: dropEffect })
                        }
                    </TableCell>
                }}
            </MediaQuery>
        )
    }
}

const renameContent = Actions.UpdateContent
const setEdited = DMSActions.SetEditedContentId

const mapStateToProps = (state, match) => {
    return {
        currentContent: Reducers.getContent(state.sensenet.children.entities, match.content.Id),
        edited: DMSReducers.getEditedItemId(state.dms),
        selected: Reducers.getSelectedContentIds(state.sensenet),
        selectedContentItems: Reducers.getSelectedContentItems(state.sensenet),
        editedFirst: DMSReducers.isEditedFirst(state.dms)
    }
}

export default connect(mapStateToProps, {
    rename: renameContent,
    setEdited: setEdited,
    copyBatch: Actions.CopyBatch,
    moveBatch: Actions.MoveBatch,
    setEditedFirst: DMSActions.setEditedFirst
})(DisplayNameCell)