import {
  Button,
  Dialog,
  DialogActions,
  FormControl,
  FormGroup,
  FormHelperText,
  InputLabel,
  List,
  Typography,
} from '@material-ui/core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactReferenceGridFieldSetting } from '../ReferenceGrid/ReferenceGridFieldSettings'
import { AvatarPicker } from './AvatarPicker'
import { DefaultAvatarTemplate } from './DefaultAvatarTemplate'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dialog: {
    padding: 20,
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

// const ADD_REFERENCE = 'Add reference'
// const CHANGE_REFERENCE = 'Change reference'
const REFERENCE_PICKER_TITLE = 'Reference picker'
const OK = 'Ok'
const CANCEL = 'Cancel'

/**
 * Interface for Avatar properties
 */
export interface AvatarProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactReferenceGridFieldSetting<T, K> {}

/**
 * Interface for Avatar state
 */
export interface AvatarState<T extends GenericContent, _K extends keyof T> {
  fieldValue: any
  pickerIsOpen: boolean
  selected: any
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
    // tslint:disable:no-string-literal
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
   * Removes the chosen item from the grid and the field value
   */
  public removeItem = (id: number) => {
    const { name, onChange } = this.props
    const value =
      this.state.fieldValue.length > 1 ? this.state.fieldValue.filter((item: GenericContent) => item.Id !== id) : []
    onChange(name, value.map((item: GenericContent) => item.Id))
    this.setState({
      fieldValue: value,
    })
  }
  public handleDialogClose = () => {
    this.setState({
      pickerIsOpen: false,
    })
  }
  public handleCancelClick = () => {
    this.setState({
      selected: [],
    })
    this.handleDialogClose()
  }
  public handleOkClick = () => {
    const { name, onChange } = this.props
    const value =
      this.state.selected.length > 0 && !this.props['data-allowMultiple']
        ? this.state.selected
        : this.state.fieldValue.concat(this.state.selected)
    onChange(name, value.map((item: GenericContent) => item.Id))

    this.setState({
      fieldValue: value,
      selected: [],
    })
    this.handleDialogClose()
  }
  public selectItem = (content: GenericContent) => {
    this.state.selected.length > 0 && !this.props['data-allowMultiple']
      ? this.setState({
          selected:
            this.state.selected.findIndex((c: GenericContent) => content.Id === c.Id) > -1
              ? this.state.selected
              : [content],
        })
      : this.setState({
          selected:
            this.state.selected.findIndex((c: GenericContent) => content.Id === c.Id) > -1
              ? this.state.selected.filter((c: GenericContent) => content.Id !== c.Id)
              : [...this.state.selected, content],
        })
  }
  /**
   * Opens a picker to choose an item to add into the grid and the field value
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
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              {itemTemplate ? (
                itemTemplate(this.state.fieldValue)
              ) : (
                <DefaultAvatarTemplate
                  repositoryUrl={this.props['data-repositoryUrl'] || ''}
                  url={this.state.fieldValue}
                  add={this.addItem}
                  actionName="edit"
                />
              )}
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <AvatarPicker
                  path={this.props['data-selectionRoot'] ? this.props['data-selectionRoot'][0] : '/Root'}
                  allowedTypes={this.props['data-allowedTypes']}
                  repository={this.props['data-repository']}
                  select={content => this.selectItem(content)}
                  selected={this.state.selected}
                />
                <DialogActions>
                  <Button variant="contained" onClick={this.handleOkClick} color="primary">
                    {OK}
                  </Button>
                  <Button variant="contained" onClick={this.handleCancelClick} color="secondary">
                    {CANCEL}
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
                  repositoryUrl={this.props['data-repositoryUrl'] || ''}
                  add={this.addItem}
                  actionName="new"
                  readOnly={this.props.readOnly}
                />
              )}
              }
              {!this.props.readOnly ? (
                <DefaultAvatarTemplate
                  repositoryUrl={this.props['data-repositoryUrl'] || ''}
                  add={this.addItem}
                  actionName="edit"
                />
              ) : null}
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <AvatarPicker
                  path={this.props['data-selectionRoot'] ? this.props['data-selectionRoot'][0] : '/Root'}
                  allowedTypes={this.props['data-allowedTypes']}
                  repository={this.props['data-repository']}
                  select={content => this.selectItem(content)}
                  selected={this.state.selected}
                />
                <DialogActions>
                  <Button variant="contained" onClick={this.handleOkClick} color="primary">
                    {OK}
                  </Button>
                  <Button variant="contained" onClick={this.handleCancelClick} color="secondary">
                    {CANCEL}
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
            <FormGroup>
              <DefaultAvatarTemplate
                repositoryUrl={this.props['data-repositoryUrl'] || ''}
                url={this.state.fieldValue}
                add={this.addItem}
                actionName="browse"
              />
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl className={className} style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props['data-labelText']}
            </InputLabel>
            <FormGroup>
              <DefaultAvatarTemplate
                repositoryUrl={this.props['data-repositoryUrl'] || ''}
                url={this.state.fieldValue}
                add={this.addItem}
                actionName="browse"
              />
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
