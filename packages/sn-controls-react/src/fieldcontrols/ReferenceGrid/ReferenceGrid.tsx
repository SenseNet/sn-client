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
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { isUser } from '../type-guards'
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

export class ReferenceGrid extends Component<ReactClientFieldSetting<ReferenceFieldSetting>, ReferenceGridState> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: ReferenceGrid['props']) {
    super(props)
    let value
    let selected
    if (!this.props.content) {
      value = []
      selected = []
    } else if (this.props.content[this.props.settings.Name]) {
      if (this.props.settings.AllowMultiple) {
        value = this.props.content[this.props.settings.Name]
        selected = this.props.content[this.props.settings.Name]
      } else {
        value = [this.props.content[this.props.settings.Name]]
        selected = [this.props.content[this.props.settings.Name]]
      }
    } else if (this.props.settings.DefaultValue) {
      if (this.props.settings.AllowMultiple) {
        value = this.props.settings.DefaultValue
        selected = this.props.settings.DefaultValue
      } else {
        value = [this.props.settings.DefaultValue]
        selected = [this.props.settings.DefaultValue]
      }
    }

    this.state = {
      fieldValue: value,
      itemLabel: 'DisplayName',
      pickerIsOpen: false,
      selected,
    }
    if (this.props.actionName === 'edit') {
      this.getSelected()
    }
  }
  /**
   * getSelected
   * @return {GenericContent[]}
   */
  public async getSelected() {
    if (!this.props.repository) {
      throw new Error('You must pass a repository to this control')
    }
    const loadPath = this.props.content
      ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props.content.Path), '/', this.props.settings.Name)
      : ''
    const references = await this.props.repository.loadCollection({
      path: loadPath,
      oDataOptions: {
        select: 'all',
      },
    })

    const { results } = references.d

    this.setState({
      fieldValue: results.map((item: GenericContent) => ({
        DisplayName: item.DisplayName,
        Icon: item.Icon,
        Id: item.Id,
        Avatar: isUser(item) ? item.Avatar : undefined,
        Type: item.Type,
      })),
    })
    return references
  }

  /**
   * Removes the chosen item from the grid and the field value
   */
  public removeItem = (id: number) => {
    const value =
      this.state.fieldValue.length > 1 ? this.state.fieldValue.filter((item: GenericContent) => item.Id !== id) : []
    this.props.fieldOnChange &&
      this.props.fieldOnChange(this.props.settings.Name, value.map((item: GenericContent) => item.Id))
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
    const value =
      this.state.selected.length > 0 && !this.props.settings.AllowMultiple
        ? this.state.selected
        : this.state.fieldValue.concat(this.state.selected)
    this.props.fieldOnChange &&
      this.props.fieldOnChange(this.props.settings.Name, value.map((item: GenericContent) => item.Id))

    this.setState({
      fieldValue: value,
      selected: [],
    })
    this.handleDialogClose()
  }
  public selectItem = (content: GenericContent) => {
    this.state.selected.length > 0 && !this.props.settings.AllowMultiple
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
    switch (this.props.actionName) {
      case 'edit':
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
              style={
                this.state.fieldValue && this.state.fieldValue.length > 0
                  ? styles.listContainer
                  : { ...styles.listContainer, width: 200 }
              }>
              {this.state.fieldValue &&
                this.state.fieldValue.map((item: GenericContent) => {
                  return (
                    <DefaultItemTemplate
                      content={item}
                      remove={this.removeItem}
                      add={this.addItem}
                      key={item.Id}
                      actionName="edit"
                      readOnly={this.props.settings.ReadOnly}
                      repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                      multiple={this.props.settings.AllowMultiple ? this.props.settings.AllowMultiple : false}
                      renderIcon={this.props.renderIcon}
                    />
                  )
                })}
              {!this.props.settings.ReadOnly ? (
                <DefaultItemTemplate
                  content={
                    this.state.fieldValue &&
                    this.state.fieldValue.length > 0 &&
                    this.props.settings.AllowMultiple &&
                    !this.props.settings.AllowMultiple
                      ? changeContent
                      : emptyContent
                  }
                  add={this.addItem}
                  actionName="edit"
                  repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                  multiple={this.props.settings.AllowMultiple ? this.props.settings.AllowMultiple : false}
                  renderIcon={this.props.renderIcon}
                />
              ) : null}
            </List>
            {this.props.settings.Description ? (
              <FormHelperText>{this.props.settings.Description}</FormHelperText>
            ) : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <ReferencePicker
                  path={this.props.settings.SelectionRoots ? this.props.settings.SelectionRoots[0] : '/Root'}
                  allowedTypes={this.props.settings.AllowedTypes}
                  repository={this.props.repository!}
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
              {this.state.fieldValue.map((item: GenericContent) => {
                return (
                  <DefaultItemTemplate
                    content={item}
                    remove={this.removeItem}
                    add={this.addItem}
                    key={item.Id}
                    actionName="new"
                    readOnly={this.props.settings.ReadOnly}
                    repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                    multiple={this.props.settings.AllowMultiple ? this.props.settings.AllowMultiple : false}
                    renderIcon={this.props.renderIcon}
                  />
                )
              })}
              {!this.props.settings.ReadOnly ? (
                <DefaultItemTemplate
                  content={
                    this.state.fieldValue.length > 0 &&
                    this.props.settings.AllowMultiple &&
                    !this.props.settings.AllowMultiple
                      ? changeContent
                      : emptyContent
                  }
                  add={this.addItem}
                  actionName="new"
                  repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                  multiple={this.props.settings.AllowMultiple ? this.props.settings.AllowMultiple : false}
                  renderIcon={this.props.renderIcon}
                />
              ) : null}
            </List>
            {this.props.settings.Description ? (
              <FormHelperText>{this.props.settings.Description}</FormHelperText>
            ) : null}

            <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
              <div style={styles.dialog}>
                <Typography variant="h5" gutterBottom={true}>
                  {REFERENCE_PICKER_TITLE}
                </Typography>
                <ReferencePicker
                  path={this.props.settings.SelectionRoots ? this.props.settings.SelectionRoots[0] : '/Root'}
                  allowedTypes={this.props.settings.AllowedTypes}
                  repository={this.props.repository!}
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
      default: {
        return this.props.content && this.props.content[this.props.settings.Name] ? (
          <FormControl style={styles.root as any}>
            <InputLabel shrink={true} htmlFor={this.props.settings.Name}>
              {this.props.settings.DisplayName}
            </InputLabel>
            <FormGroup>
              <List dense={true} style={styles.listContainer}>
                {this.props.content[this.props.settings.Name].map((item: GenericContent) => (
                  <DefaultItemTemplate
                    content={item}
                    remove={this.removeItem}
                    add={this.addItem}
                    key={item.Id}
                    actionName="browse"
                    repositoryUrl={this.props.repository!.configuration.repositoryUrl}
                    multiple={this.props.settings.AllowMultiple ? this.props.settings.AllowMultiple : false}
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
}
