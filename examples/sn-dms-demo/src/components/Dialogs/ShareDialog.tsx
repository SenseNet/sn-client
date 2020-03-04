import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Input from '@material-ui/core/Input'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Actions } from '@sensenet/redux'
import { SharingOptions } from '@sensenet/client-core'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as DMSActions from '../../Actions'
import { versionName } from '../../assets/helpers'
import { icons } from '../../assets/icons'
import { resources } from '../../assets/resources'
import { rootStateType } from '../../store/rootReducer'
import DialogInfo from './DialogInfo'

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
    fontFamily: 'Raleway Medium',
    fontSize: 14,
    margin: '20px 0',
  },
  uploadVersionButton: {
    marginRight: 20,
    backgroundColor: '#016d9e',
    color: '#fff',
  },
  actionButton: {
    margin: '0 15px',
  },
  link: {
    padding: 0,
    color: '#016D9E',
    fontSize: '13px',
    fontFamily: 'Raleway Semibold',
    textDecoration: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
}

interface ShareDialogProps extends RouteComponentProps<any> {
  currentContent: GenericContent | null
  closeCallback?: () => void
}

const mapStateToProps = (state: rootStateType) => ({
  repositoryUrl: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
  items: state.sensenet.sharing,
})

const mapDispatchToProps = {
  getSharingEntries: Actions.getSharingEntries,
  share: Actions.share,
  closeDialog: DMSActions.closeDialog,
}

type addType = 'Open' | 'Edit'

type linkSharingType = addType | 'off'

interface ShareDialogState {
  addType: addType
  addValue: string
  sharedWithValues: Array<{ value: string; type: addType; isSaved: boolean }>
  linkSharingType: linkSharingType
  anchorEl: HTMLElement | null
}

class ShareDialog extends React.Component<
  { classes: any } & ShareDialogProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps,
  ShareDialogState
> {
  public state: ShareDialogState = {
    addType: 'Open',
    addValue: '',
    linkSharingType: 'off',
    sharedWithValues: [],
    anchorEl: null,
  }
  constructor(props: ShareDialog['props']) {
    super(props)
    this.handleCancel = this.handleCancel.bind(this)
    this.submitCallback = this.submitCallback.bind(this)
    this.handleAddTypeChange = this.handleAddTypeChange.bind(this)
    this.handleAddValueChange = this.handleAddValueChange.bind(this)
    this.handleAddEntry = this.handleAddEntry.bind(this)
    this.copyUrl = this.copyUrl.bind(this)
    this.handleOpenLinkSharingMenu = this.handleOpenLinkSharingMenu.bind(this)
    this.handleCloseLinkSharingMenu = this.handleCloseLinkSharingMenu.bind(this)
    this.props.currentContent && this.props.getSharingEntries(this.props.currentContent.Id)
  }
  public static getDerivedStateFromProps(newProps: ShareDialog['props'], lastState: ShareDialog['state']) {
    const icon =
      newProps.currentContent &&
      newProps.currentContent.Icon &&
      icons[newProps.currentContent.Icon.toLowerCase() as any]
    const entries = Object.values(newProps.items)
      .map(item => Object.values(item as any))
      .reduce((acc, val) => acc.concat(val), []) // .flat()
    return {
      icon,
      sharedWithValues: [
        ...entries
          .filter((e: any) => lastState.sharedWithValues.findIndex(s => s.value === e.Token) === -1)
          .map((entry: any) => ({
            value: entry.Token,
            type: entry.Level,
            isSaved: true,
          })),
        ...lastState.sharedWithValues,
      ],
    }
  }

  public handleCancel = () => {
    this.props.closeDialog()
    this.props.closeCallback && this.props.closeCallback()
  }
  public submitCallback = (ev: { preventDefault: () => void }) => {
    ev.preventDefault()
    this.props.closeDialog()
    this.props.closeCallback && this.props.closeCallback()
    this.state.sharedWithValues
      .filter(v => !v.isSaved)
      .forEach(v => {
        const sharingOptions = {
          identity: v.value,
          content: this.props.currentContent,
          sharingLevel: v.type,
          sharingMode: 'Private',
        } as SharingOptions
        this.props.currentContent && this.props.share(sharingOptions)
      })
    this.setState({
      sharedWithValues: [],
    })
  }

  public handleAddTypeChange(event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) {
    this.setState({
      addType: (event.target as any).value,
    })
  }

  public handleAddValueChange(ev: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      addValue: ev.currentTarget.value,
    })
  }

  public formatVersionNumber = (version: string) => {
    const v = resources[`VERSION_${versionName(version.slice(-1))}`]
    return `${version.substring(0, version.length - 2)} ${v}`
  }

  public handleAddEntry(ev: React.KeyboardEvent<HTMLInputElement>) {
    const target: HTMLInputElement = ev.target as any
    if (ev.key === 'Enter' && target.form && target.form.reportValidity()) {
      ev.preventDefault()
      ev.stopPropagation()
      if (target.value && target.value.length) {
        target.value = ''
        this.setState({
          addValue: '',
          sharedWithValues: [
            ...this.state.sharedWithValues.filter(val => val.value !== this.state.addValue),
            { type: this.state.addType, value: this.state.addValue, isSaved: false },
          ],
        })
      }
    }
  }

  private getLinkSharingTypePostfix() {
    switch (this.state.linkSharingType) {
      case 'off':
        return <span>{resources.SHARE_LINK_POSTFIX_OFF}</span>
      case 'Open':
        return <span>{resources.SHARE_LINK_POSTFIX_VIEW}</span>
      case 'Edit':
        return <span>{resources.SHARE_LINK_POSTFIX_EDIT}</span>
      // no default
    }
  }

  private copyUrl() {
    const newUrl = new URL(window.location.origin)
    newUrl.hash = PathHelper.joinPaths(
      'preview',
      btoa(this.props.currentContent ? this.props.currentContent.Id.toString() : ''),
    )
    ;(navigator as any).clipboard.writeText(newUrl.toString()).then(() => {
      /** Link copied */
    })
  }

  private handleOpenLinkSharingMenu(event: React.MouseEvent<HTMLElement>) {
    this.setState({ anchorEl: event.currentTarget })
  }

  private handleCloseLinkSharingMenu(newType?: linkSharingType) {
    this.setState({ anchorEl: null })
    if (newType) {
      this.setState({
        linkSharingType: newType,
      })
    }
  }

  public render() {
    const { currentContent, repositoryUrl } = this.props
    return (
      <MediaQuery minWidth={700}>
        {matches => (
          <form onSubmit={this.submitCallback}>
            {matches ? (
              <Typography variant="h5" gutterBottom={true}>
                {resources.SHARE}
              </Typography>
            ) : null}
            <div
              style={{
                ...styles.inner,
                ...{
                  minWidth: matches ? '550px' : 0,
                  margin: matches ? undefined : '0 0 20px 0px',
                },
              }}>
              <DialogInfo currentContent={currentContent} hideVersionInfo={true} repositoryUrl={repositoryUrl} />
              <Divider />
              {matches ? null : (
                <Typography variant="body1" style={{ paddingTop: '1em' }}>
                  <strong>Share with</strong>
                </Typography>
              )}
              <div
                style={{
                  display: 'flex',
                  margin: '10px 0',
                  flexDirection: matches ? undefined : 'column',
                  justifyContent: matches ? undefined : 'space-evenly',
                  height: matches ? undefined : '120px',
                }}>
                <Input
                  defaultValue={this.state.addValue}
                  style={{ flexGrow: matches ? 1 : undefined }}
                  type="email"
                  onChange={this.handleAddValueChange}
                  placeholder={resources.SHARE_EMAIL_INPUT_PLACEHOLDER}
                  onKeyPress={this.handleAddEntry as any}
                />

                {matches ? null : (
                  <div style={{ marginTop: '6px' }}>
                    {this.state.sharedWithValues.length ? (
                      <div style={{ margin: '0.3em 0px .3em', padding: '1em 0' }}>
                        <strong>{resources.SHARED_WITH} </strong>
                        {this.state.sharedWithValues.map(v => v.value).join(', ')}
                        <Divider />
                      </div>
                    ) : null}
                  </div>
                )}

                <Select
                  onChange={this.handleAddTypeChange}
                  value={this.state.addType}
                  inputProps={{
                    name: 'addType',
                  }}>
                  <MenuItem value={`Open`}>{resources.SHARE_PERMISSION_VIEW}</MenuItem>
                  <MenuItem value={`Edit`}>{resources.SHARE_PERMISSION_EDIT}</MenuItem>
                </Select>
              </div>
              {matches && this.state.sharedWithValues.length ? (
                <div>
                  <div style={{ fontSize: '.85em', margin: '.3em 0 1.5em 0' }}>
                    <strong>{resources.SHARED_WITH} </strong>
                    {this.state.sharedWithValues.map(v => v.value).join(', ')}
                  </div>
                  <Divider />
                </div>
              ) : null}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1em 0' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {this.state.linkSharingType !== 'off' ? <span>{resources.SHARE_LINK_PREFIX} </span> : null}
                  <strong>&nbsp;{this.getLinkSharingTypePostfix()}</strong>

                  <Button
                    style={{ ...styles.link, display: 'inline-flex', margin: '0 7px', fontSize: '18px' }}
                    aria-owns={this.state.anchorEl ? 'simple-menu' : ''}
                    aria-haspopup="true"
                    onClick={this.handleOpenLinkSharingMenu}>
                    <Icon fontSize="inherit" type={iconType.materialui} iconName="arrow_drop_down" />
                    <Icon fontSize="inherit" type={iconType.materialui} iconName="edit" />
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={() => this.handleCloseLinkSharingMenu}>
                    <MenuItem onClick={() => this.handleCloseLinkSharingMenu('off')}>
                      {resources.SHARE_LINK_POSTFIX_OFF}
                    </MenuItem>
                    <MenuItem onClick={() => this.handleCloseLinkSharingMenu('Open')}>
                      {resources.SHARE_LINK_POSTFIX_VIEW}
                    </MenuItem>
                    <MenuItem onClick={() => this.handleCloseLinkSharingMenu('Edit')}>
                      {resources.SHARE_LINK_POSTFIX_EDIT}
                    </MenuItem>
                  </Menu>
                </div>
                <Button style={{ ...styles.link, fontSize: '12px' }} onClick={this.copyUrl}>
                  <Icon type={iconType.materialui} iconName="link" /> &nbsp;
                  {resources.SHARE_COPY_LINK}
                </Button>
              </div>
            </div>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: matches ? 'space-between' : 'flex-end' }}>
              {matches ? <Button style={styles.link}>{resources.MORE_SHARE_OPTIONS}</Button> : null}
              <div>
                {matches ? (
                  <Button style={styles.actionButton} onClick={this.handleCancel}>
                    {resources.CANCEL}
                  </Button>
                ) : null}

                <Button
                  disabled={this.state.sharedWithValues.length === 0}
                  style={styles.actionButton}
                  variant="contained"
                  color="secondary"
                  type="submit">
                  {resources.OK}
                </Button>
              </div>
            </div>
          </form>
        )}
      </MediaQuery>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles as any)(ShareDialog)))
