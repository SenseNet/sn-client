import * as React from 'react'
import { connect } from 'react-redux'
import { Content } from 'sn-client-js'
import { Actions, Reducers } from 'sn-redux'
import { TableCell } from 'material-ui/Table';
import TextField from 'material-ui/TextField';

const styles = {
    displayName: {
        fontWeight: 'bold'
    },
    hoveredDisplayName: {
        fontWeight: 'bold',
        color: '#03a9f4',
        textDecoration: 'underline',
        cursor: 'pointer'
    },
    editedTitle: {
        fontWeight: 'normal',
        fontStyle: 'italic'
    },
}

interface IDisplayNameCellProps {
    content: Content,
    isHovered: boolean,
    handleRowDoubleClick: Function,
    handleRowSingleClick: Function,
    rename: Function,
    currentContent
}

interface IDisplayNameCellState {
    clicks,
    oldText,
    newText,
    edited
}

class DisplayNameCell extends React.Component<IDisplayNameCellProps, IDisplayNameCellState>{
    constructor(props) {
        super(props)

        this.state = {
            clicks: 0,
            oldText: this.props.content.DisplayName,
            newText: '',
            edited: null
        }

        this.handleTitleClick = this.handleTitleClick.bind(this)
        this.handleTitleLongClick = this.handleTitleLongClick.bind(this)
        this.handleTitleInputBlur = this.handleTitleInputBlur.bind(this)
        this.handleTitleChange = this.handleTitleChange.bind(this)
    }
    handleTitleClick(e, id) {
        let that = this;
        if (e.target.id !== 'renameInput') {
            that.setState({
                clicks: this.state.clicks + 1
            })
            if (that.state.clicks === 1) {
                setTimeout(function () {
                    if (that.state.clicks === 1) {
                        that.props.handleRowSingleClick(e, id);
                    } else {
                        that.handleTitleLongClick(e, id)
                    }
                    that.setState({
                        clicks: 0
                    })
                }, 1000);
            }
        }
    }
    handleTitleLongClick(e, id) {
        this.setState({
            edited: id
        })
    }
    handleTitleChange(e) {
        this.setState({
            newText: e.target.value
        })
    }
    handleTitleInputBlur(id) {
        if (this.state.oldText !== this.state.newText) {
            this.updateDisplayName()
        }
        else
            this.setState({
                edited: null,
                newText: ''
            })
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.updateDisplayName()
        }
    }
    updateDisplayName() {
        let c = this.props.currentContent;
        let updateableContent = c.repository.HandleLoadedContent(c, c._type)
        updateableContent.DisplayName = this.state.newText
        this.props.rename(updateableContent)
        this.setState({
            edited: null,
            newText: ''
        })
    }
    isEdited(id) { return this.state.edited === id }
    render() {
        const content = this.props.currentContent
        const isEdited = this.isEdited(content.Id);
        return (
            <TableCell
                style={this.props.isHovered && !isEdited ? styles.hoveredDisplayName : styles.displayName as any}
                onClick={event => this.handleTitleClick(event, content.Id)}
                onDoubleClick={event => this.props.handleRowDoubleClick(event, content.Id)}>
                {isEdited ?
                    <TextField
                        id='renameInput'
                        autoFocus
                        defaultValue={content.DisplayName}
                        margin='dense'
                        style={styles.editedTitle as any}
                        onChange={event => this.handleTitleChange(event)}
                        onKeyPress={event => this.handleKeyPress(event)}
                        onBlur={event => this.handleTitleInputBlur(content.Id)} /> :
                    content.DisplayName}
            </TableCell>
        )
    }
}

const renameContent = Actions.UpdateContent

const mapStateToProps = (state, match) => {
    return {
        currentContent: Reducers.getContent(state.sensenet.children.entities, match.content.Id)
    }
}

export default connect(mapStateToProps, {
    rename: renameContent
})(DisplayNameCell)