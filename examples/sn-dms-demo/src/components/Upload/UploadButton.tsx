import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Icon, iconType } from '@sensenet/icons-react'
import React from 'react'
import { v1 } from 'uuid'
import { resources } from '../../assets/resources'
import { theme } from '../../assets/theme'

const styles = {
  menuItem: {
    padding: '6px 15px',
    minHeight: 24,
    display: 'flex',
    lineHeight: 1,
    minWidth: 145,
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    padding: 0,
    fontSize: '0.9rem',
    fontFamily: 'Raleway Medium',
  },
}

export interface UploadButtonProps {
  accept?: string
  multiple?: boolean
  handleUpload: (files: FileList) => void
  style: React.CSSProperties
}

export interface UploadButtonState {
  anchorElement: HTMLElement | undefined
}

export const UPLOAD_FILE_BUTTON_ID = 'sn-dms-upload-button'
export const UPLOAD_FOLDER_BUTTON_ID = 'sn-dms-upload-button'
export const UPLOAD_MENU_ID = 'sn-dms-upload-button'

export class UploadButton extends React.Component<UploadButtonProps, UploadButtonState> {
  private readonly uploadFileButtonId = `${UPLOAD_FILE_BUTTON_ID}-${v1()}`
  private readonly uploadFolderButtonId = `${UPLOAD_FOLDER_BUTTON_ID}-${v1()}`
  private readonly uploadMenuId = `${UPLOAD_MENU_ID}-${v1()}`

  public state: UploadButtonState = {
    anchorElement: undefined,
  }

  private async handleUpload(ev: React.ChangeEvent<HTMLInputElement>) {
    ev.persist()
    ev.target.files && (await this.props.handleUpload(ev.target.files))
  }

  private toggleOpen = (ev: React.MouseEvent<HTMLElement>) => {
    this.setState({
      ...this.state,
      anchorElement: this.state.anchorElement ? undefined : ev.currentTarget,
    })
  }

  private closeMenu() {
    this.setState({
      ...this.state,
      anchorElement: undefined,
    })
  }

  public render() {
    return (
      <ClickAwayListener onClickAway={() => this.closeMenu()}>
        <div style={this.props.style}>
          <Button
            aria-owns={this.state.anchorElement ? this.uploadMenuId : undefined}
            aria-haspopup={true}
            variant="contained"
            component="span"
            color="primary"
            style={{
              color: '#fff',
              width: '100%',
              fontFamily: 'Raleway Bold',
              textTransform: 'none',
              fontSize: '14px',
              paddingTop: 6,
              paddingBottom: 6,
              letterSpacing: 1,
            }}
            onClick={this.toggleOpen}>
            <Icon
              type={iconType.flaticon}
              iconName="upload-button"
              style={{ marginRight: 5, color: '#fff', textAlign: 'center' }}
            />
            {resources.UPLOAD_BUTTON_TITLE}
          </Button>
          <Menu
            id={this.uploadMenuId}
            open={Boolean(this.state.anchorElement)}
            anchorEl={this.state.anchorElement}
            getContentAnchorEl={undefined}
            anchorOrigin={{
              horizontal: 'left',
              vertical: 'bottom',
            }}
            style={{
              width: '100%',
            }}>
            <label htmlFor={this.uploadFileButtonId} style={{ outline: 'none' }}>
              <MenuItem style={styles.menuItem}>
                <ListItemIcon style={styles.icon}>
                  <div>
                    <Icon
                      type={iconType.materialui}
                      iconName="insert_drive_file"
                      style={{ color: theme.palette.primary.main }}
                    />
                    <Icon
                      type={iconType.materialui}
                      iconName="forward"
                      style={{
                        position: 'absolute',
                        left: '0.86em',
                        top: '0.28em',
                        width: '0.5em',
                        color: 'white',
                        transform: 'rotate(-90deg)',
                      }}
                    />
                  </div>
                </ListItemIcon>
                <ListItemText
                  style={styles.text}
                  primary={resources.UPLOAD_BUTTON_UPLOAD_FILE_TITLE}
                  disableTypography={true}
                />
              </MenuItem>
            </label>
            <label htmlFor={this.uploadFolderButtonId} tabIndex={-1} style={{ outline: 'none' }}>
              <MenuItem style={styles.menuItem}>
                <ListItemIcon style={styles.icon}>
                  <div>
                    <Icon type={iconType.materialui} iconName="folder" style={{ color: theme.palette.primary.main }} />
                    <Icon
                      type={iconType.materialui}
                      iconName="forward"
                      style={{
                        position: 'absolute',
                        left: '0.87em',
                        top: '0.22em',
                        width: '0.5em',
                        color: 'white',
                        transform: 'rotate(-90deg)',
                      }}
                    />
                  </div>
                </ListItemIcon>
                <ListItemText
                  style={styles.text}
                  primary={resources.UPLOAD_BUTTON_UPLOAD_FOLDER_TITLE}
                  disableTypography={true}
                />
              </MenuItem>
            </label>
          </Menu>
          {!this.state.anchorElement ? (
            <div style={{ visibility: 'hidden', display: 'none' }}>
              <input
                accept={this.props.accept}
                multiple={this.props.multiple}
                id={this.uploadFileButtonId}
                type="file"
                onChange={ev => this.handleUpload(ev)}
              />
              <input
                accept={this.props.accept}
                multiple={this.props.multiple}
                id={this.uploadFolderButtonId}
                type="file"
                onChange={ev => this.handleUpload(ev)}
                {...({
                  directory: '',
                  webkitdirectory: '',
                } as any)}
              />
            </div>
          ) : null}
        </div>
      </ClickAwayListener>
    )
  }
}
