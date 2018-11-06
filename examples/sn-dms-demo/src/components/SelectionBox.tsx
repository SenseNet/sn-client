import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import { Icon, iconType } from '@sensenet/icons-react'
import { Reducers } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../Actions'

const batchActions = [
    {
        DisplayName: 'Copy selected',
        Icon: 'copy',
        Name: 'CopyBatch',
    },
    {
        DisplayName: 'Move selected',
        Icon: 'move',
        Name: 'MoveBatch',
    },
    {
        DisplayName: 'Delete selected',
        Icon: 'delete',
        Name: 'DeleteBatch',
    },
    {
        DisplayName: 'Clear selection',
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
        const { selected } = this.props
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
                        key="menu"
                        aria-label="Menu"
                        onClick={(event) => this.handleClick(event)}
                        color="inherit"
                    >
                        <Icon type={iconType.materialui} iconName="more_vert" />
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
})(SelectionBox)
