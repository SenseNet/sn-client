import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/core/styles/withStyles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import { GenericContent } from '@sensenet/default-content-types'
import { User } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import moment from 'moment'
import * as React from 'react'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import * as DMSActions from '../../Actions'
import { versionName } from '../../assets/helpers'
import { resources } from '../../assets/resources'
import { Version } from '../../Reducers'
import { rootStateType } from '../../store/rootReducer'
import DialogInfo from './DialogInfo'
import RestoreVersionsDialog from './RestoreVersionDialog'

const styles = {
  buttonContainer: {
    display: 'flex',
    height: 32,
  },
  containerChild: {
    flexGrow: 1,
    display: 'inline-flex',
  },
  rightColumn: {
    textAlign: 'right',
    flexGrow: 1,
    marginLeft: 'auto',
  },
  inner: {
    minWidth: 550,
    fontFamily: 'Raleway Medium',
    fontSize: 14,
    margin: '20px 0',
  },
  innerMobile: {
    fontFamily: 'Raleway Medium',
    fontSize: 14,
  },
  innerMobileList: {
    margin: 0,
    border: 0,
    boxShadow: 'none',
  },
  uploadVersionButton: {
    marginRight: 20,
    backgroundColor: '#016d9e',
    color: '#fff',
  },
  tableHead: {
    fontFamily: 'Raleway SemiBold',
    fontSize: 12,
    color: '#000',
    border: 0,
    paddingBottom: 0,
  },
  tableCell: {
    border: 0,
    fontStyle: 'italic',
    fontSize: 12,
  },
  tableRow: {
    height: 24,
  },
  table: {
    boxShadow: '0px 0px 3px 0px rgba(0,0,0,0.3)',
    minWidth: 800,
    marginTop: 10,
  },
  versionNumber: {
    color: '#016D9E',
    fontFamily: 'Raleway Semibold',
    fontSize: 13,
  },
  versionTableHead: {
    fontFamily: 'Raleway Semibold',
    fontSize: 12,
    color: '#000',
    opacity: 0.54,
  },
  versionTableCell: {
    fontSize: 13,
    width: '26%',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: 200,
  },
  tableContainer: {},
  tableContainerScroll: {
    maxHeight: 300,
    overflowY: 'auto',
    padding: 5,
  },
  mobileTitle: {
    fontFamily: 'Raleway Semibold',
    fontSize: 14,
  },
  mobileVersionsTitle: {
    padding: 20,
    borderBottom: 'solid 1px #E0E0E0',
    fontFamily: 'Raleway ExtraBold',
    fontSize: 12,
    opacity: 0.54,
  },
  heading: {
    fontFamily: 'Raleway SemiBold',
    fontSize: 14,
    color: '#016D9E',
    flexGrow: 1,
  },
  mobileVersionListItem: {
    padding: '0 0 10px',
  },
  restoreButtonMobile: {
    height: 24,
  },
}

interface VersionsDialogProps {
  currentContent: GenericContent | null
  closeCallback?: () => void
}

const mapStateToProps = (state: rootStateType) => {
  return {
    versions: state.dms.versions as Version[],
    repositoryUrl: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
  }
}

const mapDispatchToProps = {
  closeDialog: DMSActions.closeDialog,
  getVersionList: DMSActions.loadVersions,
  openDialog: DMSActions.openDialog,
}

interface VersionsDialogState {
  versions: Version[]
  expanded: string | boolean
}

class VersionsDialog extends React.Component<
  { classes: any } & VersionsDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  VersionsDialogState
> {
  public state: VersionsDialogState = {
    versions: [],
    expanded: 'panel0',
  }
  constructor(props: VersionsDialog['props']) {
    super(props)
    this.props.getVersionList(this.props.currentContent ? this.props.currentContent.Id : 0)
    this.handleRestoreButtonClick = this.handleRestoreButtonClick.bind(this)
    this.handleExpandButtonClick = this.handleExpandButtonClick.bind(this)
  }
  public static getDerivedStateFromProps(newProps: VersionsDialog['props'], lastState: VersionsDialogState) {
    if (newProps.versions && newProps.versions.length !== lastState.versions.length) {
      newProps.getVersionList(newProps.currentContent ? newProps.currentContent.Id : 0)
    }
    return {
      ...lastState,
      versions: newProps.versions,
    }
  }

  public handleCancel = () => {
    this.props.closeDialog()
    if (this.props.closeCallback) {
      this.props.closeCallback()
    }
  }
  public submitCallback = () => {
    this.props.closeDialog()
    if (this.props.closeCallback) {
      this.props.closeCallback()
    }
  }
  public formatVersionNumber = (version: string) => {
    const v = resources[`VERSION_${versionName(version.slice(-1))}`]
    return `${version.substring(0, version.length - 2)} ${v}`
  }
  public handleRestoreButtonClick = (id: number, version: string, name: string) => {
    this.props.closeDialog()
    this.props.openDialog(<RestoreVersionsDialog id={id} version={version} fileName={name} />)
  }
  public handleExpandButtonClick = (panel: string) => {
    this.setState({
      expanded: this.state.expanded ? panel : false,
    })
  }
  public render() {
    const { classes, currentContent, repositoryUrl, versions } = this.props
    const { expanded } = this.state
    return (
      <MediaQuery minDeviceWidth={700}>
        {matches => {
          return (
            <div>
              <Typography variant="headline" gutterBottom={true}>
                {resources.VERSIONS}
              </Typography>
              <div style={matches ? styles.inner : styles.innerMobile}>
                <DialogInfo currentContent={currentContent} repositoryUrl={repositoryUrl} />
                {matches ? (
                  <div style={versions.length > 3 ? styles.tableContainerScroll : styles.tableContainer}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox" className={classes.versionTableHead}>
                            {resources.VERSION}
                          </TableCell>
                          <TableCell padding="checkbox" className={classes.versionTableHead}>
                            {resources.MODIFIED}
                          </TableCell>
                          <TableCell padding="checkbox" className={classes.versionTableHead}>
                            {resources.COMMENT}
                          </TableCell>
                          <TableCell padding="checkbox" className={classes.versionTableHead}>
                            {resources.REJECT_REASON}
                          </TableCell>
                          <TableCell padding="none" className={classes.versionTableHead} />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {versions.map((version: Version, index: number) => (
                          <TableRow key={index}>
                            <TableCell padding="checkbox" className={classes.versionNumber}>
                              {this.formatVersionNumber(version.Version || '')}
                            </TableCell>
                            <TableCell padding="checkbox" className={classes.versionTableCell}>
                              <Moment fromNow={true}>
                                {
                                  // tslint:disable-next-line:no-string-literal
                                  version['versionModificationDate']
                                }
                              </Moment>
                              {// tslint:disable-next-line:no-string-literal
                              ` (${((version['versionModifiedBy'] as any) as User)['FullName']})`}
                            </TableCell>
                            <TableCell padding="checkbox" className={classes.versionTableCell}>
                              <Tooltip
                                disableFocusListener={true}
                                title={version.CheckInComments ? version.CheckInComments : ''}>
                                <span>{version.CheckInComments ? version.CheckInComments : ''}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell padding="checkbox" className={classes.versionTableCell}>
                              <Tooltip
                                disableFocusListener={true}
                                title={version.RejectReason ? version.RejectReason : ''}>
                                <span>{version.RejectReason ? version.RejectReason : ''}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell padding="none" style={{ width: '5%' }}>
                              {index !== versions.length - 1 ? (
                                <IconButton
                                  title={resources.RESTORE_VERSION}
                                  onClick={() =>
                                    this.handleRestoreButtonClick(
                                      currentContent ? currentContent.Id : 0,
                                      version.Version || '',
                                      version.Name,
                                    )
                                  }>
                                  <Icon type={iconType.materialui} iconName="restore" color="error" />
                                </IconButton>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Paper>
                    <Typography style={styles.mobileVersionsTitle}>{resources.VERSIONS}</Typography>
                    {versions.map((version: Version, index: number) => (
                      <ExpansionPanel
                        style={styles.innerMobileList}
                        key={`panel${index}`}
                        expanded={expanded === `panel${index}`}
                        onChange={() => this.handleExpandButtonClick(`panel${index}`)}>
                        <ExpansionPanelSummary
                          expandIcon={
                            versions.length > 1 ? <Icon type={iconType.materialui} iconName="expand_more" /> : false
                          }>
                          <div style={{ flexGrow: 1, display: 'flex' }}>
                            <Typography style={styles.heading}>
                              {this.formatVersionNumber(version.Version ? version.Version : '')}
                            </Typography>
                            {index !== versions.length - 1 ? (
                              <IconButton
                                style={styles.restoreButtonMobile}
                                title={resources.RESTORE_VERSION}
                                onClick={() =>
                                  this.handleRestoreButtonClick(
                                    currentContent ? currentContent.Id : 0,
                                    version.Version ? version.Version : '',
                                    version.Name,
                                  )
                                }>
                                <Icon type={iconType.materialui} iconName="restore" color="error" />
                              </IconButton>
                            ) : null}
                          </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <List dense={false}>
                            <ListItem style={styles.mobileVersionListItem}>
                              <ListItemText
                                primary={resources.MODIFIED}
                                secondary={
                                  // tslint:disable-next-line:no-string-literal
                                  `${moment(version['versionModificationDate']).fromNow()} (${
                                    ((version.versionModifiedBy as any) as User).FullName
                                  })`
                                }
                              />
                            </ListItem>
                            {version.CheckInComments ? (
                              <ListItem style={styles.mobileVersionListItem}>
                                <ListItemText primary={resources.COMMENT} secondary={version.CheckInComments} />
                              </ListItem>
                            ) : null}
                            {version.RejectReason ? (
                              <ListItem style={styles.mobileVersionListItem}>
                                <ListItemText primary={resources.REJECT_REASON} secondary={version.RejectReason} />
                              </ListItem>
                            ) : null}
                          </List>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    ))}
                  </Paper>
                )}
              </div>
            </div>
          )
        }}
      </MediaQuery>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles as any)(VersionsDialog))
