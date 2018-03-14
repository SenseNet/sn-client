import { GenericContent } from '@sensenet/default-content-types'
import { Actions } from '@sensenet/redux'
import Add from 'material-ui-icons/Add'
import Button from 'material-ui/Button'
import * as React from 'react'
import { connect } from 'react-redux'
import {
    withRouter,
} from 'react-router-dom'
import * as DMSActions from '../Actions'
import * as DMSReducers from '../Reducers'

const styles = {
    actionButton: {
        color: '#fff',
        position: 'fixed',
        bottom: 10,
        right: 10,
    },
}

interface FloatingActionButton {
    actionMenuIsOpen: boolean,
    content: GenericContent,
    actions,
    openActionMenu,
    closeActionMenu,
    getActions,
}

class FloatingActionButton extends React.Component<FloatingActionButton, {}> {
    constructor(props) {
        super(props)
    }
    public handleActionMenuClick(e) {
        const { content, actions } = this.props
        this.props.closeActionMenu()
        this.props.getActions(content, 'New', [{ DisplayName: 'Upload document', Name: 'Upload', Icon: 'upload', CssClass: 'borderTop' }])
        this.props.openActionMenu(actions, content.Id, content.DisplayName, { top: e.clientY - 300, left: e.clientX - 220 })
    }
    public render() {
        const { actionMenuIsOpen } = this.props
        return (
            <Button variant="fab" color="secondary" aria-label="add" style={styles.actionButton as any}
                onClick={(event) => this.handleActionMenuClick(event)} >
                <Add aria-label="Menu" />
            </Button>
        )
    }
}

const mapStateToProps = (state, match) => {
    return {
        actions: DMSReducers.getActions(state.dms.actionmenu),
    }
}
export default withRouter(connect(mapStateToProps, {
    openActionMenu: DMSActions.openActionMenu,
    closeActionMenu: DMSActions.closeActionMenu,
    getActions: Actions.loadContentActions,
})(FloatingActionButton))
