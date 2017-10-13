import * as React from 'react'
import { connect } from 'react-redux'
import { Reducers } from 'sn-redux'
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import Snackbar, { SnackbarContent } from 'material-ui/Snackbar';
import MoreVert from 'material-ui-icons/MoreVert';
import IconButton from 'material-ui/IconButton';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    button: {
      color: '#fff',
    },
  });

const batchActions = [
    {
        DisplayName : 'Copy selected',
        Icon: 'copy',
        Name: 'CopyBatch'
    },
    {
        DisplayName : 'Move selected',
        Icon: 'move',
        Name: 'MoveBatch'
    },
    {
        DisplayName : 'Delete selected',
        Icon: 'delete',
        Name: 'DeleteBatch'
    },
    {
        DisplayName : 'Clear selection',
        Icon: 'clear',
        Name: 'ClearSelection'
    }
]

interface ISelectionBoxProps {
    selected,
    classes,
    openActionMenu: Function
}
interface ISelectionBoxState {
}

class SelectionBox extends React.Component<ISelectionBoxProps, ISelectionBoxState> {
    constructor(props) {
        super(props)
    }
    handleClick(e) { 
        const rect = e.currentTarget.getBoundingClientRect()
        this.props.openActionMenu(batchActions, this.props.selected, `${this.props.selected.length} Items selected`, { top: rect.top - 200, left: rect.left })
    }
    render() {
        const { selected, classes } = this.props
        const count = selected.length
        return <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={selected.length > 0}>
            <SnackbarContent
                message={`${count} Items selected`}
                action={
                    <IconButton
                        aria-label='Menu'
                        onClick={event => this.handleClick(event)}
                        className={classes.button}
                    >
                        <MoreVert  />
                    </IconButton>
                }
            />
        </Snackbar>
    }
}

const mapStateToProps = (state, match) => {
    return {
        selected: Reducers.getSelectedContent(state.sensenet)
    }
}

export default connect(mapStateToProps, {
    openActionMenu: DMSActions.OpenActionMenu
})(withStyles(styles)(SelectionBox))