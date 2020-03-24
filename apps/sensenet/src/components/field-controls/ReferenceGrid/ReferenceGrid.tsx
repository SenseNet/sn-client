import { Avatar, Chip, createStyles, IconButton, Theme, withStyles, WithStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import InputLabel from '@material-ui/core/InputLabel'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { InsertDriveFile } from '@material-ui/icons'
import { PathHelper } from '@sensenet/client-utils'
import { renderIconDefault } from '@sensenet/controls-react/src/fieldcontrols/icon'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import React, { Component } from 'react'
import { LocalizationContext } from '../../../context'
import { ReactClientFieldSetting } from '../ClientFieldSetting'
import { isUser } from '../type-guards'
import { DefaultItemTemplate } from './DefaultItemTemplate'
import { ReferencePicker } from './ReferencePicker'

const styles = ({ palette }: Theme) =>
  createStyles({
    formControl: {
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
      marginTop: '9px',
      borderBottom: '1px solid rgba(80, 80, 80, 0.87)',
    },
    dialog: {
      padding: 20,
      '& .MuiDialogActions-root': {
        backgroundColor: palette.type === 'light' ? '#FFFFFF' : '#121212',
      },
    },
    listContainer: {
      display: 'block',
      marginTop: 10,
    },
    labelWrapper: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    chip: {
      border: 'none',
    },
    change: {
      cursor: 'pointer',
      fontSize: '12px',
      marginTop: '11px',
      color: palette.primary.main,
    },
  })

/**
 * Interface for ReferenceGrid state
 */
export interface ReferenceGridState {
  fieldValue: GenericContent[]
  pickerIsOpen: boolean
  selected: GenericContent[]
}

class ReferenceGridComponent extends Component<
  ReactClientFieldSetting<ReferenceFieldSetting> & WithStyles<typeof styles>,
  ReferenceGridState
> {
  constructor(props: ReferenceGridComponent['props']) {
    super(props)

    this.state = {
      fieldValue: [],
      pickerIsOpen: false,
      selected: [],
    }
    if (this.props.actionName === 'edit') {
      this.getSelected()
    }
  }

  public async getSelected() {
    try {
      if (!this.props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      const loadPath = this.props.content
        ? PathHelper.joinPaths(PathHelper.getContentUrl(this.props.content.Path), '/', this.props.settings.Name)
        : ''
      const references = await this.props.repository.load({
        idOrPath: loadPath,
        oDataOptions: {
          select: 'all',
        },
      })
      let result = [references.d]
      if (Object.prototype.hasOwnProperty.call(references.d, 'results')) {
        result = (references.d as any).results
      }

      this.setState({
        fieldValue: result,
        selected: result,
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  /**
   * Removes the chosen item from the grid and the field value
   */
  public removeItem = (id: number) => {
    const value = this.state.fieldValue.length > 1 ? this.state.fieldValue.filter(item => item.Id !== id) : []
    this.props.fieldOnChange &&
      this.props.fieldOnChange(
        this.props.settings.Name,
        value.map(item => item.Id),
      )
    this.setState({
      fieldValue: value,
      selected: value,
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
      selected: this.state.fieldValue,
    })
    this.handleDialogClose()
  }

  public handleOkClick = () => {
    this.props.fieldOnChange &&
      this.props.fieldOnChange(
        this.props.settings.Name,
        this.state.selected.map((item: GenericContent) => item.Id),
      )

    this.setState({
      fieldValue: this.state.selected,
    })
    this.handleDialogClose()
  }

  public selectItem = (content: GenericContent) => {
    this.state.selected.length > 0 && !this.props.settings.AllowMultiple
      ? this.setState({
          selected: this.state.selected.findIndex(c => content.Id === c.Id) > -1 ? this.state.selected : [content],
        })
      : this.setState({
          selected:
            this.state.selected.findIndex(c => content.Id === c.Id) > -1
              ? this.state.selected.filter(c => content.Id !== c.Id)
              : [...this.state.selected, content],
        })
  }

  public render() {
    switch (this.props.actionName) {
      case 'new':
      case 'edit':
        return (
          <LocalizationContext.Consumer>
            {localization => (
              <>
                <div className={this.props.classes.labelWrapper}>
                  <InputLabel
                    shrink={true}
                    htmlFor={this.props.settings.Name}
                    required={this.props.settings.Compulsory}>
                    {this.props.settings.DisplayName}
                  </InputLabel>
                  <IconButton
                    disabled={this.state.fieldValue && this.state.fieldValue.length !== 0}
                    color={'primary'}
                    style={{ padding: 0, height: '24px', width: '24px' }}
                    onClick={() => this.addItem()}>
                    {this.props.renderIcon ? this.props.renderIcon('add_circle') : renderIconDefault('add_circle')}
                  </IconButton>
                </div>
                <FormControl className={this.props.classes.formControl} key={this.props.settings.Name}>
                  {this.state.fieldValue.map((item: GenericContent) => {
                    const repositoryUrl = this.props.repository ? this.props.repository.configuration.repositoryUrl : ''
                    return item.Type ? (
                      isUser(item) ? (
                        <>
                          <Chip
                            className={this.props.classes.chip}
                            key={item.Id}
                            variant="outlined"
                            onDelete={() => this.removeItem(item.Id)}
                            icon={
                              <Avatar
                                alt={item.FullName}
                                src={
                                  item.Avatar && item.Avatar.Url && repositoryUrl
                                    ? `${repositoryUrl}${item.Avatar.Url}`
                                    : ''
                                }
                                style={{ height: '24px', width: '24px' }}
                              />
                            }
                            label={item.DisplayName}
                          />
                        </>
                      ) : (
                        <Chip
                          className={this.props.classes.chip}
                          key={item.Id}
                          variant="outlined"
                          onDelete={() => this.removeItem(item.Id)}
                          icon={<InsertDriveFile style={{ height: '24px', width: '24px' }} />}
                          label={item.DisplayName}
                        />
                      )
                    ) : null
                  })}
                  {this.state.fieldValue && this.state.fieldValue.length !== 0 ? (
                    <div className={this.props.classes.change} onClick={() => this.addItem()}>
                      {localization.values.forms.changeReference}
                    </div>
                  ) : null}

                  <Dialog onClose={this.handleDialogClose} open={this.state.pickerIsOpen}>
                    <div className={this.props.classes.dialog}>
                      <Typography variant="h5" gutterBottom={true}>
                        {localization.values.forms.referencePicker}
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
                          {localization.values.forms.ok}
                        </Button>
                        <Button variant="contained" onClick={this.handleCancelClick} color="secondary">
                          {localization.values.forms.cancel}
                        </Button>
                      </DialogActions>
                    </div>
                  </Dialog>
                </FormControl>
              </>
            )}
          </LocalizationContext.Consumer>
        )
      case 'browse':
      default: {
        return this.props.fieldValue ? (
          <FormControl className={this.props.classes.formControl}>
            <InputLabel shrink={true} htmlFor={this.props.settings.Name}>
              {this.props.settings.DisplayName}
            </InputLabel>
            <FormGroup>
              <List dense={true} className={this.props.classes.listContainer}>
                {Array.isArray(this.props.fieldValue)
                  ? (this.props.fieldValue as any).map((item: GenericContent) => (
                      <DefaultItemTemplate
                        content={item}
                        remove={this.removeItem}
                        add={this.addItem}
                        key={item.Id}
                        actionName="browse"
                        repositoryUrl={this.props.repository ? this.props.repository.configuration.repositoryUrl : ''}
                        multiple={this.props.settings.AllowMultiple ? this.props.settings.AllowMultiple : false}
                        renderIcon={this.props.renderIcon}
                      />
                    ))
                  : null}
              </List>
            </FormGroup>
          </FormControl>
        ) : null
      }
    }
  }
}
export const ReferenceGrid = withStyles(styles)(ReferenceGridComponent)
