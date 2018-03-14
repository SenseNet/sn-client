import { Reducers } from '@sensenet/redux'
import MoreVert from 'material-ui-icons/MoreVert'
import IconButton from 'material-ui/IconButton'
import Snackbar, { SnackbarContent } from 'material-ui/Snackbar'
import { withStyles } from 'material-ui/styles'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../Actions'

const styles = (theme) => ({
    button: {
      color: '#fff',
    },
  })

const batchActions = [
    {
        DisplayName : 'Copy selected',
        Icon: 'copy',
        Name: 'CopyBatch',
    },
    {
        DisplayName : 'Move selected',
        Icon: 'move',
        Name: 'MoveBatch',
    },
    {
        DisplayName : 'Delete selected',
        Icon: 'delete',
        Name: 'DeleteBatch',
    },
    {
        DisplayName : 'Clear selection',
        Icon: 'clear',
        Name: 'ClearSelection',
    },
]

interface SelectionBoxProps {
    selected,
    classes,
    openActionMenu
}

class SelectionBox extends React.Component<SelectionBoxProps, {}> {
    constructor(props) {
        super(props)
    }
    public handleClick(e) {
        const rect = e.currentTarget.getBoundingClientRect()
        this.props.openActionMenu(batchActions, this.props.selected, `${this.props.selected.length} Items selected`, { top: rect.top - 200, left: rect.left })
    }
    public render() {
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
                        aria-label="Menu"
                        onClick={(event) => this.handleClick(event)}
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
        selected: Reducers.getSelectedContentIds(state.sensenet),
    }
}

export default connect(mapStateToProps, {
    openActionMenu: DMSActions.openActionMenu,
})(withStyles(styles)(SelectionBox))
