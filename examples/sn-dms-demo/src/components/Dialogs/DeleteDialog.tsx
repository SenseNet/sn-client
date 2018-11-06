import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { Actions } from '@sensenet/redux'
import * as React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { rootStateType } from '../..'
import * as DMSActions from '../../Actions'
import { resources } from '../../assets/resources'

const styles = {
    buttonContainer: {
        display: 'flex',
        height: 32,
    },
    containerChild: {
        flexGrow: 1,
        display: 'inline-flex',
        opacity: .54,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: '6px 10px',
    },
    inner: {
        minWidth: 550,
        fontFamily: 'Raleway Medium',
        fontSize: 14,
        margin: '20px 0',
    },
    rightColumn: {
        textAlign: 'right',
        flexGrow: 1,
        marginLeft: 'auto',
    },
    listItem: {
        listStyleType: 'none',
        lineHeight: '25px',
    },
    list: {
        margin: '10px 0 0',
        padding: 0,
    },
    label: {
        fontSize: 14,
    },
    longList: {
        maxHeight: 300,
        overflowY: 'auto',
        padding: 5,
    },
    normalList: {},
}

interface DeleteDialogProps {
    permanent?: boolean,
}

interface DeleteDialogState {
    checked: boolean,
}

const mapStateToProps = (state: rootStateType) => {
    return {
        selected: state.dms.documentLibrary.selected,
        currentitems: state.sensenet.currentitems.entities,
        closeCallback: state.dms.dialog.onClose,
    }
}

const mapDispatchToProps = {
    closeDialog: DMSActions.closeDialog,
    deleteContent: Actions.deleteBatch,
}

class DeleteDialog extends React.Component<{ classes } & DeleteDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, DeleteDialogState> {
    public state = {
        checked: this.props.permanent === null || !this.props.permanent ? false : true,
    }
    public handleCheckboxClick = () => {
        this.setState({
            checked: !this.state.checked,
        })
    }
    public handleCancel = () => {
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public submitCallback = () => {
        const permanently = this.state.checked ? true : false
        const selectedIds = this.props.selected.map((content) => content.Id)
        this.props.deleteContent(selectedIds, permanently)
        this.props.closeDialog()
        this.props.closeCallback()
    }
    public render() {
        const { classes, selected } = this.props
        return (
            <MediaQuery minDeviceWidth={700}>
                {(matches) =>
                    <div>
                        <Typography variant="headline" gutterBottom>
                            {resources.DELETE}
                        </Typography>
                        <div style={styles.inner}>
                            <div style={{ opacity: .54 }}>{resources.ARE_YOU_SURE_YOU_WANT_TO_DELETE}</div>
                            <div style={selected.length > 3 ? styles.longList : styles.normalList}>
                                <ul style={styles.list}>
                                    {selected.map((content) => <li
                                        key={content.Id}
                                        style={styles.listItem}>
                                        {content.DisplayName}
                                    </li>,
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div style={styles.buttonContainer}>
                            <div style={styles.containerChild}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.checked}
                                            onChange={() => this.handleCheckboxClick()}
                                            value="checked"
                                            color="primary"
                                        />
                                    }
                                    label={<span className={classes.label}>{resources.DELETE_PERMANENTLY}</span>}
                                />
                            </div>
                            <div style={styles.rightColumn as any}>
                                {matches ? <Button color="default" style={{ marginRight: 20 }} onClick={() => this.handleCancel()}>{resources.CANCEL}</Button> : null}
                                <Button onClick={() => this.submitCallback()} variant="raised" color="secondary" style={styles.deleteButton}>{resources.DELETE}</Button>
                            </div>
                        </div>
                    </div >
                }
            </MediaQuery>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(DeleteDialog))
