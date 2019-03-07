import { Avatar, Icon, ListItem, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { DefaultItemTemplate } from './DefaultItemTemplate'
import { ReactReferenceGridFieldSetting } from './ReferenceGridFieldSettings'
import { ReferencePicker } from './ReferencePicker'

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
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  icon: {
    marginRight: 0,
  },
}

const ADD_REFERENCE = 'Add reference'
const CHANGE_REFERENCE = 'Change reference'
const REFERENCE_PICKER_TITLE = 'Reference picker'
const OK = 'Ok'
const CANCEL = 'Cancel'

const emptyContent = {
  DisplayName: ADD_REFERENCE,
  Icon: '',
  Id: -1,
} as GenericContent

const changeContent = {
  DisplayName: CHANGE_REFERENCE,
  Icon: '',
  Id: -2,
} as GenericContent

/**
 * Interface for RefernceGrid properties
 */
export interface ReferenceGridProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactReferenceGridFieldSetting<T, K> {}
/**
 * Interface for TagsInput state
 */
export interface ReferenceGridState<T extends GenericContent, _K extends keyof T> {
  fieldValue: any
  itemLabel: string
  pickerIsOpen: boolean
  selected: any
}

export class ReferenceGrid<T extends GenericContent, K extends keyof T> extends Component<
  ReferenceGridProps<T, K>,
  ReferenceGridState<T, K>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ReferenceGrid<T, K>['props']) {
    super(props)
    /**
     * @type {object}
     * @property {string} value default value
     */
    this.state = {
      fieldValue:
        this.props['data-fieldValue'] && this.props['data-fieldValue'].length > 0
          ? this.props['data-fieldValue']
          : this.props['data-defaultValue']
          ? this.props['data-defaultValue']
          : [],
      itemLabel: this.props['data-defaultDisplayName'] || 'DisplayName',
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
      fieldValue:
        references.d.results.length > 0
          ? references.d.results.map((item: GenericContent) => ({
              // tslint:disable-next-line:no-string-literal
              DisplayName: item.DisplayName,
              Icon: item.Icon,
              Id: item.Id,
            }))
          : [],
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
  /**
   * Opens a picker to choose an item to add into the grid and the field value
   */
  public addItem = () => {
    this.setState({
      pickerIsOpen: true,
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
   * render
   * @return {ReactElement} markup
   */
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
              {this.state.fieldValue.map((item: GenericContent) => {
                if (itemTemplate) {
                  return itemTemplate(item)
                } else {
                  return (
                    <DefaultItemTemplate content={item} remove={this.removeItem} add={this.addItem} key={item.Id} />
                  )
                }
              })}
              <DefaultItemTemplate
                content={
                  this.state.fieldValue.length > 0 && !this.props['data-allowMultiple'] ? changeContent : emptyContent
                }
                add={this.addItem}
              />
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <ReferencePicker
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
              {this.state.fieldValue.map((item: GenericContent) => {
                if (itemTemplate) {
                  return itemTemplate(item)
                } else {
                  return (
                    <DefaultItemTemplate content={item} remove={this.removeItem} add={this.addItem} key={item.Id} />
                  )
                }
              })}
              <DefaultItemTemplate
                content={
                  this.state.fieldValue.length > 0 && !this.props['data-allowMultiple'] ? changeContent : emptyContent
                }
                add={this.addItem}
              />
            </List>
            {this.props['data-hintText'] ? <FormHelperText>{this.props['data-hintText']}</FormHelperText> : null}
            {this.props['data-errorText'] ? <FormHelperText>{this.props['data-errorText']}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <ReferencePicker
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
          <FormControl component={'fieldset' as 'div'} className={className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              <List dense={true} style={styles.listContainer}>
                {this.state.fieldValue.map((item: GenericContent) => (
                  <ListItem key={item.Id} button={false}>
                    {item.Type !== undefined ? (
                      item.Type === 'User' ? (
                        <ListItemAvatar>
                          {
                            // tslint:disable-next-line: no-string-literal
                            <Avatar alt={item['FullName']} src={item['Avatar'].Url} />
                          }
                        </ListItemAvatar>
                      ) : (
                        <ListItemIcon style={styles.icon}>
                          <Icon>
                            <InsertDriveFile />
                          </Icon>
                        </ListItemIcon>
                      )
                    ) : null}
                    <ListItemText
                      primary={item.DisplayName}
                      style={item.Id < 0 ? { textAlign: 'right' } : { textAlign: 'left' }}
                    />
                  </ListItem>
                ))}
              </List>
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={'fieldset' as 'div'} className={className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: any) => (
                <FormControl component={'fieldset' as 'div'}>
                  <FormControlLabel style={{ marginLeft: 0 }} label="aaa" control={<span />} key={value} />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
