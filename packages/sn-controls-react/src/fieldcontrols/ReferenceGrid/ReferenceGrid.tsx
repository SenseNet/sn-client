import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { Component } from 'react'
// import { isUser } from '../type-guards'
import { ReactReferenceGridFieldSetting } from '../field-settings/ReferenceGridFieldSettings'
import { DefaultItemTemplate } from './DefaultItemTemplate'
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

const ADD_REFERENCE = 'Add reference'
const CHANGE_REFERENCE = 'Change reference'
const REFERENCE_PICKER_TITLE = 'Reference picker'
const OK = 'Ok'
const CANCEL = 'Cancel'

const emptyContent = {
  DisplayName: ADD_REFERENCE,
  Icon: '',
  Id: -1,
  Path: '',
  Type: '',
  Name: 'AddReference',
}

const changeContent = {
  DisplayName: CHANGE_REFERENCE,
  Icon: '',
  Id: -2,
  Path: '',
  Type: '',
  Name: 'ChangeReference',
}

/**
 * Interface for ReferenceGrid state
 */
export interface ReferenceGridState {
  fieldValue: any
  itemLabel: string
  pickerIsOpen: boolean
  selected: any
}

export class ReferenceGrid extends Component<ReactReferenceGridFieldSetting, ReferenceGridState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ReferenceGrid['props']) {
    super(props)
    let value
    let selected
    if (this.props.value) {
      if (this.props.allowMultiple) {
        ;({ value } = this.props)
        selected = this.props.value
      } else {
        value = [this.props.value]
        selected = [this.props.value]
      }
    } else if (this.props.defaultValue) {
      if (this.props.allowMultiple) {
        value = this.props.defaultValue
        selected = this.props.defaultValue
      } else {
        value = [this.props.defaultValue]
        selected = [this.props.defaultValue]
      }
    } else {
      value = []
      selected = []
    }

    this.state = {
      fieldValue: value,
      itemLabel: this.props.defaultDisplayName || 'DisplayName',
      pickerIsOpen: false,
      selected,
    }
    this.getSelected = this.getSelected.bind(this)
    if (this.props.actionName === 'edit') {
      this.getSelected()
    }
  }
  /**
   * getSelected
   * @return {GenericContent[]}
   */
  public async getSelected() {
    const loadPath = this.props.content
      ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props.content.Path), '/', this.props.fieldName.toString())
      : ''
    const references = await this.props.repository.loadCollection({
      path: loadPath,
      oDataOptions: {
        select: 'all',
      },
    })
    // TODO: review this!
    // const results = references.d.results
    //   ? references.d.results.length > 0
    //     ? references.d.results
    //     : []
    //   : [references.d]

    this.setState({
      // fieldValue: results.map((item: GenericContent | User) => ({
      //   DisplayName: item.DisplayName,
      //   Icon: item.Icon,
      //   Id: item.Id,
      //   Avatar: isUser(item) ? item.Avatar : undefined,
      //   Type: item.Type,
      // })),
    })
    return references
  }
  /**
   * Removes the chosen item from the grid and the field value
   */
  public removeItem = (id: number) => {
    const { fieldName: name, fieldOnChange: onChange } = this.props
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
    const { fieldName: name, fieldOnChange: onChange } = this.props
    const value =
      this.state.selected.length > 0 && !this.props.allowMultiple
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
    this.state.selected.length > 0 && !this.props.allowMultiple
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
    const { className, fieldName: name, required, itemTemplate, repository } = this.props
    switch (this.props.actionName) {
      case 'edit':
        return (
          <FormControl
            className={className}
            style={styles.root as any}
            key={name.toString()}
            component={'fieldset' as 'div'}
            required={required}>
            <InputLabel shrink={true} htmlFor={name.toString()}>
              {this.props.labelText}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              {this.state.fieldValue.map((item: GenericContent) => {
                if (itemTemplate) {
                  return itemTemplate(item)
                } else {
                  return (
                    <DefaultItemTemplate
                      content={item}
                      remove={this.removeItem}
                      add={this.addItem}
                      key={item.Id}
                      actionName="edit"
                      readOnly={this.props.readOnly}
                      repositoryUrl={repository.configuration.repositoryUrl}
                      multiple={this.props.allowMultiple ? this.props.allowMultiple : false}
                      renderIcon={this.props.renderIcon}
                    />
                  )
                }
              })}
              {!this.props.readOnly ? (
                <DefaultItemTemplate
                  content={
                    this.state.fieldValue.length > 0 && this.props.allowMultiple && !this.props.allowMultiple
                      ? changeContent
                      : emptyContent
                  }
                  add={this.addItem}
                  actionName="edit"
                  repositoryUrl={repository.configuration.repositoryUrl}
                  multiple={this.props.allowMultiple ? this.props.allowMultiple : false}
                  renderIcon={this.props.renderIcon}
                />
              ) : null}
            </List>
            {this.props.hintText ? <FormHelperText>{this.props.hintText}</FormHelperText> : null}
            {this.props.errorText ? <FormHelperText>{this.props.errorText}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <ReferencePicker
                  path={this.props.selectionRoot ? this.props.selectionRoot[0] : '/Root'}
                  allowedTypes={this.props.allowedTypes}
                  repository={repository}
                  select={content => this.selectItem(content)}
                  selected={this.state.selected}
                  renderIcon={this.props.renderIcon}
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
              {this.props.labelText}
            </InputLabel>
            <List
              dense={true}
              style={this.state.fieldValue.length > 0 ? styles.listContainer : { ...styles.listContainer, width: 200 }}>
              {this.state.fieldValue.map((item: GenericContent) => {
                if (itemTemplate) {
                  return itemTemplate(item)
                } else {
                  return (
                    <DefaultItemTemplate
                      content={item}
                      remove={this.removeItem}
                      add={this.addItem}
                      key={item.Id}
                      actionName="new"
                      readOnly={this.props.readOnly}
                      repositoryUrl={repository.configuration.repositoryUrl}
                      multiple={this.props.allowMultiple ? this.props.allowMultiple : false}
                      renderIcon={this.props.renderIcon}
                    />
                  )
                }
              })}
              {!this.props.readOnly ? (
                <DefaultItemTemplate
                  content={
                    this.state.fieldValue.length > 0 && this.props.allowMultiple && !this.props.allowMultiple
                      ? changeContent
                      : emptyContent
                  }
                  add={this.addItem}
                  actionName="new"
                  repositoryUrl={repository.configuration.repositoryUrl}
                  multiple={this.props.allowMultiple ? this.props.allowMultiple : false}
                  renderIcon={this.props.renderIcon}
                />
              ) : null}
            </List>
            {this.props.hintText ? <FormHelperText>{this.props.hintText}</FormHelperText> : null}
            {this.props.errorText ? <FormHelperText>{this.props.errorText}</FormHelperText> : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <ReferencePicker
                  path={this.props.selectionRoot ? this.props.selectionRoot[0] : '/Root'}
                  allowedTypes={this.props.allowedTypes}
                  repository={repository}
                  select={content => this.selectItem(content)}
                  selected={this.state.selected}
                  renderIcon={this.props.renderIcon}
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
        return this.state.fieldValue.length > 0 ? (
          <FormControl className={className} style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props.labelText}
            </InputLabel>
            <FormGroup>
              <List dense={true} style={styles.listContainer}>
                {this.state.fieldValue.map((item: GenericContent) => (
                  <DefaultItemTemplate
                    content={item}
                    remove={this.removeItem}
                    add={this.addItem}
                    key={item.Id}
                    actionName="browse"
                    repositoryUrl={repository.configuration.repositoryUrl}
                    multiple={this.props.allowMultiple ? this.props.allowMultiple : false}
                    renderIcon={this.props.renderIcon}
                  />
                ))}
              </List>
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.state.fieldValue.length > 0 ? (
          <FormControl className={className} style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={name as string}>
              {this.props.labelText}
            </InputLabel>
            <FormGroup>
              <List dense={true} style={styles.listContainer}>
                {this.state.fieldValue.map((item: GenericContent) => (
                  <DefaultItemTemplate
                    content={item}
                    remove={this.removeItem}
                    add={this.addItem}
                    key={item.Id}
                    actionName="browse"
                    repositoryUrl={repository.configuration.repositoryUrl}
                    multiple={this.props.allowMultiple ? this.props.allowMultiple : false}
                    renderIcon={this.props.renderIcon}
                  />
                ))}
              </List>
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
