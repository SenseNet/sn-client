import { ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import { changeJScriptValue } from '@sensenet/controls-react'
import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core'
import { renderIconDefault } from '../icon'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { LocalizationContext } from '../../../context'
import { AvatarPicker } from './AvatarPicker'
import { DefaultAvatarTemplate } from './DefaultAvatarTemplate'

const styles = ({ palette }: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    dialog: {
      padding: 20,
      minWidth: 250,
      '& .MuiDialogActions-root': {
        backgroundColor: palette.type === 'light' ? '#FFFFFF' : '#121212',
      },
    },
    listContainer: {
      display: 'block',
      padding: 0,
    },
    closeButton: {
      position: 'absolute',
      right: 0,
    },
    icon: {
      marginRight: 0,
    },
    centeredVertical: {
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'center',
    },
  })

const DEFAULT_AVATAR_PATH = '/Root/Sites/Default_Site/demoavatars/Admin.png'

/**
 * Interface for Avatar state
 */
export interface AvatarState {
  fieldValue: any
  pickerIsOpen: boolean
  selected?: User
}

class AvatarComponent extends Component<
  ReactClientFieldSetting<ReferenceFieldSetting, User> & WithStyles<typeof styles>,
  AvatarState
> {
  state: AvatarState = {
    fieldValue:
      (this.props.fieldValue && (this.props.fieldValue as any).Url) ||
      changeJScriptValue(this.props.settings.DefaultValue) ||
      '',
    pickerIsOpen: false,
    selected: undefined,
  }

  /**
   * Removes the item and clears the field value
   */
  public removeItem = () => {
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, DEFAULT_AVATAR_PATH)
    this.setState({
      fieldValue: '',
    })
    this.handleDialogClose()
  }

  public handleDialogClose = () => {
    this.setState({
      pickerIsOpen: false,
    })
  }

  public handleCancelClick = () => {
    this.setState({
      selected: undefined,
    })
    this.handleDialogClose()
  }

  public handleOkClick = () => {
    const content = this.state.selected
    if (content && content.Path && this.state.fieldValue !== content.Path) {
      this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, content.Path)

      this.setState({
        fieldValue: content.Path,
        selected: undefined,
      })
    }
    this.handleDialogClose()
  }

  public selectItem = (content: User) => {
    this.setState({
      selected: content,
    })
  }
  /**
   * Opens a picker to choose an item
   */
  public addItem = () => {
    this.setState({
      pickerIsOpen: true,
    })
  }

  public render() {
    switch (this.props.actionName) {
      case 'new':
      case 'edit':
        return (
          <LocalizationContext.Consumer>
            {(localization) => (
              <FormControl
                className={this.props.classes.root}
                key={this.props.settings.Name}
                component={'fieldset' as 'div'}
                required={this.props.settings.Compulsory}>
                <List dense={true} className={this.props.classes.listContainer}>
                  <DefaultAvatarTemplate
                    repositoryUrl={this.props.repository && this.props.repository.configuration.repositoryUrl}
                    add={this.addItem}
                    actionName={this.props.actionName}
                    readOnly={this.props.settings.ReadOnly}
                    url={this.state.fieldValue}
                    renderIcon={this.props.renderIcon ? this.props.renderIcon : renderIconDefault}
                  />
                </List>

                <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
                  <div className={this.props.classes.dialog}>
                    <Typography variant="h5" gutterBottom={true}>
                      {localization.values.forms.avatarPicker}
                    </Typography>
                    <AvatarPicker
                      path={
                        this.props.uploadFolderPath ||
                        (this.props.settings.SelectionRoots && this.props.settings.SelectionRoots[0]) ||
                        this.state.fieldValue.substring(0, this.state.fieldValue.lastIndexOf('/')) ||
                        ''
                      }
                      repository={this.props.repository!}
                      select={this.selectItem}
                      renderIcon={this.props.renderIcon ? this.props.renderIcon : renderIconDefault}
                      remove={this.removeItem}
                    />
                    <DialogActions>
                      <Button onClick={this.handleCancelClick}>{localization.values.forms.cancel}</Button>
                      <Button variant="contained" onClick={this.handleOkClick} color="secondary">
                        {localization.values.forms.ok}
                      </Button>
                    </DialogActions>
                  </div>
                </Dialog>
              </FormControl>
            )}
          </LocalizationContext.Consumer>
        )
      case 'browse':
      default:
        return this.props.fieldValue ? (
          <div className={this.props.classes.centeredVertical}>
            <List dense={true} className={this.props.classes.listContainer}>
              <DefaultAvatarTemplate
                repositoryUrl={this.props.repository && this.props.repository.configuration.repositoryUrl}
                url={(this.props.fieldValue as any).Url}
                actionName="browse"
                renderIcon={this.props.renderIcon ? this.props.renderIcon : renderIconDefault}
              />
            </List>
            <InputLabel shrink={true} htmlFor={this.props.settings.Name} style={{ paddingTop: '9px' }}>
              {this.props.settings.DisplayName}
            </InputLabel>
          </div>
        ) : (
          <InputLabel shrink={true} htmlFor={this.props.settings.Name} style={{ paddingTop: '9px' }}>
            {this.props.settings.DisplayName}
          </InputLabel>
        )
    }
  }
}
export const Avatar = withStyles(styles)(AvatarComponent)
