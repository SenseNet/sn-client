import Fade from '@material-ui/core/Fade'
import IconButton from '@material-ui/core/IconButton'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import * as React from 'react'
import { connect } from 'react-redux'
import * as DMSActions from '../Actions'
import * as DMSReducers from '../Reducers'

// enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

interface MessageBarProps {
    messagebarProps,
    OpenMessageBar,
    CloseMessageBar
}

interface MessageBarState {
    open: boolean
}

class MessageBar extends React.Component<MessageBarProps, MessageBarState> {
    public handleClose = (event, reason?) => {
        this.props.CloseMessageBar()
    }
    public render() {
        const { open, content, vertical, horizontal } = this.props.messagebarProps
        return (
            <Snackbar
                anchorOrigin={{
                    vertical,
                    horizontal,
                }}
                open={open}
                autoHideDuration={6000}
                TransitionComponent={Fade}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{content.message}</span>}
                onClose={this.handleClose}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        // className={classes.close}
                        onClick={this.handleClose}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messagebarProps: DMSReducers.getMessageBarProps(state.dms),
    }
}

export default connect(mapStateToProps, {
    OpenMessageBar: DMSActions.openMessageBar,
    CloseMessageBar: DMSActions.closeMessageBar,
})(MessageBar)
