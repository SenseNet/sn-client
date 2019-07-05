import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { GenericContent, ReferenceFieldSetting, User } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { renderIconDefault } from '../icon'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { AvatarPicker } from './AvatarPicker'
import { DefaultAvatarTemplate } from './DefaultAvatarTemplate'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dialog: {
    padding: 20,
    minWidth: 250,
  },
  listContainer: {
    display: 'block',
    marginTop: 10,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  icon: {
    marginRight: 0,
  },
}

const AVATAR_PICKER_TITLE = 'Avatar picker'
const OK = 'Ok'
const CANCEL = 'Cancel'
const DEFAULT_AVATAR_PATH = '/Root/Sites/Default_Site/demoavatars/Admin.png'

/**
 * Interface for Avatar state
 */
export interface AvatarState {
  fieldValue: any
  pickerIsOpen: boolean
  selected?: GenericContent
}

export class Avatar extends Component<ReactClientFieldSetting<ReferenceFieldSetting, User>, AvatarState> {
  state: AvatarState = {
    fieldValue:
      (this.props.content && this.props.content.Avatar && this.props.content.Avatar.Url) ||
      this.props.settings.DefaultValue ||
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

  public selectItem = (content: GenericContent) => {
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
      case 'edit':
      case 'new':
        return (
          <FormControl
            style={styles.root as any}
            key={this.props.settings.Name}
            component={'fieldset' as 'div'}
            required={this.props.settings.Compulsory}>
            <InputLabel shrink={true} htmlFor={this.props.settings.Name}>
              {this.props.settings.DisplayName}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              {
                <DefaultAvatarTemplate
                  repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                  add={this.addItem}
                  actionName={this.props.actionName}
                  readOnly={this.props.settings.ReadOnly}
                  url={this.state.fieldValue}
                  remove={this.removeItem}
                  renderIcon={this.props.renderIcon ? this.props.renderIcon : renderIconDefault}
                />
              }
            </List>
            {this.props.settings.Description ? (
              <FormHelperText>{this.props.settings.Description}</FormHelperText>
            ) : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {AVATAR_PICKER_TITLE}
                </Typography>
                <AvatarPicker
                  path={
                    this.props.uploadFolderPath ||
                    (this.props.settings.SelectionRoots && this.props.settings.SelectionRoots[0]) ||
                    ''
                  }
                  repository={this.props.repository!}
                  select={content => this.selectItem(content)}
                  renderIcon={this.props.renderIcon ? this.props.renderIcon : renderIconDefault}
                />
                <DialogActions>
                  <Button onClick={this.handleCancelClick}>{CANCEL}</Button>
                  <Button variant="contained" onClick={this.handleOkClick} color="secondary">
                    {OK}
                  </Button>
                </DialogActions>
              </div>
            </Dialog>
          </FormControl>
        )
      case 'browse':
      default:
        return this.props.content && this.props.content.Avatar ? (
          <FormControl style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={this.props.settings.Name}>
              {this.props.settings.DisplayName}
            </InputLabel>
            <List
              dense={true}
              style={this.props.content.Avatar.Url ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              <DefaultAvatarTemplate
                repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                url={this.props.content.Avatar.Url}
                add={this.addItem}
                actionName="browse"
                renderIcon={this.props.renderIcon ? this.props.renderIcon : renderIconDefault}
              />
            </List>
          </FormControl>
        ) : null
    }
  }
}
