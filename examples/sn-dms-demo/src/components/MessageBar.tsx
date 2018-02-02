import * as React from 'react'
import { connect } from 'react-redux'
import { DMSReducers } from '../Reducers'
import { DMSActions } from '../Actions'
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Fade from 'material-ui/transitions/Fade';

// enum MessageMode { error = 'error', warning = 'warning', info = 'info' }

interface MessageBarProps {
    messagebarProps,
    OpenMessageBar: Function,
    CloseMessageBar: Function
}

interface MessageBarState {
    open: boolean
}

class MessageBar extends React.Component<MessageBarProps, MessageBarState>{
    handleClose = (event, reason?) => {
        this.props.CloseMessageBar()
    };
    render() {
        const { open, content, vertical, horizontal } = this.props.messagebarProps
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: vertical,
                    horizontal: horizontal,
                }}
                open={open}
                autoHideDuration={6000}
                transition={Fade}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{content.message}</span>}
                onClose={this.handleClose}
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        //className={classes.close}
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
        messagebarProps: DMSReducers.getMessageBarProps(state.dms)
    }
}

export default connect(mapStateToProps, {
    OpenMessageBar: DMSActions.OpenMessageBar,
    CloseMessageBar: DMSActions.CloseMessageBar
})(MessageBar)