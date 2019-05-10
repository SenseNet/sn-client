import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { renderIconDefault } from '../icon'
import { ReactAvatarFieldSetting } from './AvatarFieldSetting'
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
 * Interface for Avatar properties
 */
export interface AvatarProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactAvatarFieldSetting<T, K> {}

/**
 * Interface for Avatar state
 */
export interface AvatarState<T extends GenericContent, _K extends keyof T> {
  fieldValue: any
  pickerIsOpen: boolean
  selected: GenericContent
}

export class Avatar<T extends GenericContent, K extends keyof T> extends Component<
  AvatarProps<T, K>,
  AvatarState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: Avatar<T, K>['props']) {
    super(props)
    this.state = {
      fieldValue:
        this.props['data-fieldValue'] && this.props['data-fieldValue'].length > 0
          ? this.props['data-fieldValue']
          : this.props['data-defaultValue']
          ? this.props['data-defaultValue']
          : [],
      pickerIsOpen: false,
      selected:
        this.props['data-fieldValue'] && this.props['data-fieldValue'].length > 0
          ? this.props['data-fieldValue']
          : this.props['data-defaultValue']
          ? this.props['data-defaultValue']
          : [],
    }
    this.getSelected = this.getSelected.bind(this)
    if (this.props['data-actionName'] === 'edit') {
      this.getSelected()
    }
  }
  /**
   * getSelected
   * @return {GenericContent[]}
   */
  public async getSelected() {
    const loadPath = this.props['content']
      ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props['content'].Path), '/', this.props.name.toString())
      : ''
    const references = await this.props['data-repository'].loadCollection({
      path: loadPath,
      oDataOptions: {
        select: 'all',
      },
    })
    this.setState({
      fieldValue: references.d.Avatar.Url.length > 0 ? references.d.Avatar.Url : '',
    })
    return references
  }
  /**
   * Removes the item and clears the field value
   */
  public removeItem = () => {
    const { name, onChange } = this.props
    onChange(name, DEFAULT_AVATAR_PATH as any)
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
      selected: {} as GenericContent,
    })
    this.handleDialogClose()
  }
  public handleOkClick = () => {
    const { name, onChange } = this.props
    const content = this.state.selected
    if (content.Path && this.state.fieldValue !== content.Path) {
      onChange(name, content.Path as any)

      this.setState({
        fieldValue: content.Path,
        selected: {} as GenericContent,
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
    const { className, name, required, itemTemplate } = this.props
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl
            className={className}
            style={styles.root as any}
            key={name as string}
            component={'fieldset' as 'div'}
            required={required}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 150 }}>
              {itemTemplate ? (
                itemTemplate(this.state.fieldValue)
              ) : (
                <DefaultAvatarTemplate
                  repositoryUrl={this.props['data-repository'].configuration.repositoryUrl}
                  url={this.state.fieldValue}
                  add={this.addItem}
                  remove={this.removeItem}
                  actionName="edit"
                  renderIcon={this.props['data-renderIcon'] ? this.props['data-renderIcon'] : renderIconDefault}
                />
              )}
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {AVATAR_PICKER_TITLE}
                </Typography>
                <AvatarPicker
                  path={
                    this.props['data-selectionRoot']
                      ? this.props['data-selectionRoot'][0]
                      : `/Root/Profiles/Public/${this.props['content'].Name}/Document_Library`
                  }
                  allowedTypes={this.props['data-allowedTypes']}
                  repository={this.props['data-repository']}
                  select={content => this.selectItem(content)}
                  selected={this.state.selected}
                  repositoryUrl={this.props['data-repository'].configuration.repositoryUrl}
                  renderIcon={this.props['data-renderIcon'] ? this.props['data-renderIcon'] : renderIconDefault}
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
      case 'new':
        return (
          <FormControl
            className={className}
            style={styles.root as any}
            key={name as string}
            component={'fieldset' as 'div'}
            required={required}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              {itemTemplate ? (
                itemTemplate(this.state.fieldValue)
              ) : (
                <DefaultAvatarTemplate
                  repositoryUrl={this.props['data-repository'].configuration.repositoryUrl}
                  add={this.addItem}
                  actionName="new"
                  readOnly={this.props.readOnly}
                  remove={this.removeItem}
                  renderIcon={this.props['data-renderIcon'] ? this.props['data-renderIcon'] : renderIconDefault}
                />
              )}
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {AVATAR_PICKER_TITLE}
                </Typography>
                <AvatarPicker
                  path={
                    this.props['data-selectionRoot']
                      ? this.props['data-selectionRoot'][0]
                      : this.props['data-uploadFolderPath']
                  }
                  allowedTypes={this.props['data-allowedTypes']}
                  repository={this.props['data-repository']}
                  select={content => this.selectItem(content)}
                  selected={this.state.selected}
                  repositoryUrl={this.props['data-repository'].configuration.repositoryUrl}
                  renderIcon={this.props['data-renderIcon'] ? this.props['data-renderIcon'] : renderIconDefault}
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
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl className={className} style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              <DefaultAvatarTemplate
                repositoryUrl={this.props['data-repository'].configuration.repositoryUrl}
                url={this.state.fieldValue}
                add={this.addItem}
                actionName="browse"
                renderIcon={this.props['data-renderIcon'] ? this.props['data-renderIcon'] : renderIconDefault}
              />
            </List>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl className={className} style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              <DefaultAvatarTemplate
                repositoryUrl={this.props['data-repository'].configuration.repositoryUrl}
                url={this.state.fieldValue}
                add={this.addItem}
                actionName="browse"
                renderIcon={this.props['data-renderIcon'] ? this.props['data-renderIcon'] : renderIconDefault}
              />
            </List>
          </FormControl>
        ) : null
    }
  }
}
