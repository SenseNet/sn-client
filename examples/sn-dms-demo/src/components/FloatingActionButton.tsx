import * as React from 'react';
import {
    withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import { Actions } from 'sn-redux'
import { DMSActions } from '../Actions'
import { DMSReducers } from '../Reducers'
import { Content } from 'sn-client-js'
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';

const styles = {
    actionButton: {
        color: '#fff',
        position: 'fixed',
        bottom: 10,
        right: 10
    }
}

interface IFloatingActionButton {
    actionMenuIsOpen: boolean,
    content: Content,
    actions,
    openActionMenu: Function,
    closeActionMenu: Function,
    getActions: Function,
}

class FloatingActionButton extends React.Component<IFloatingActionButton, {}> {
    constructor(props) {
        super(props)
    }
    handleActionMenuClick(e) {
        const { content, actions } = this.props;
        this.props.closeActionMenu()
        this.props.getActions(content, 'New', [{ DisplayName: 'Upload document', Name: 'Upload', Icon: 'upload', CssClass: 'borderTop' }])
        this.props.openActionMenu(actions, content.Id, content.DisplayName, { top: e.clientY - 300, left: e.clientX - 220 })
    }
    render() {
        const { actionMenuIsOpen } = this.props
        return (
            <Button fab color="accent" aria-label="add" style={styles.actionButton as any}
                aria-owns={actionMenuIsOpen}
                onClick={event => this.handleActionMenuClick(event)} >
                <Add aria-label="Menu" />
            </Button>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu)
    }
}
export default withRouter(connect(mapStateToProps, {
    openActionMenu: DMSActions.OpenActionMenu,
    closeActionMenu: DMSActions.CloseActionMenu,
    getActions: Actions.RequestContentActions,
})(FloatingActionButton))