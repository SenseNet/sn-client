import { ConstantContent, ODataCollectionResponse } from '@sensenet/client-core'
import { ContentType, GenericContent } from '@sensenet/default-content-types'
import { typeicons } from '@sensenet/controls-react'
import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FormControl from '@material-ui/core/FormControl'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { createStyles, InputLabel, withStyles, WithStyles } from '@material-ui/core'
import clsx from 'clsx'
import { LocalizationContext } from '../../context'
import { renderIconDefault } from './icon'
import { ReactClientFieldSetting } from './ClientFieldSetting'

const ITEM_HEIGHT = 48

const styles = () =>
  createStyles({
    inputContainer: {
      padding: '4px 0',
      display: 'flex',
      alignItems: 'center',
      boxShadow: 'none',
      position: 'relative',
    },
    input: {
      flex: 1,
    },
    listContainer: {
      position: 'absolute',
      top: '40px',
      maxHeight: ITEM_HEIGHT * 5,
      overflow: 'auto',
      zIndex: 10,
    },
    ddIsOpened: {
      display: 'block',
    },
    ddIsClosed: {
      display: 'none',
    },
    list: {
      padding: 0,
      marginTop: '9px',
      height: '80px',
      overflowY: 'scroll',
    },
  })

const compare = (a: GenericContent, b: GenericContent) => {
  if (a.Name < b.Name) {
    return -1
  }
  if (a.Name > b.Name) {
    return 1
  }
  return 0
}

/**
 * Interface for AllowedChildTypes state
 */
export interface AllowedChildTypesState {
  value: string[]
  effectiveAllowedChildTypes: ContentType[]
  allowedTypesOnCTD: ContentType[]
  items: ContentType[]
  removeable: boolean
  allCTDs: ContentType[]
  isLoading: boolean
  inputValue: string
  isOpened: boolean
  anchorEl: HTMLElement
  getMenuItem: (item: ContentType, select: (item: ContentType) => void) => JSX.Element
  filteredList: ContentType[]
  selected: ContentType | null
}
/**
 * Field control that represents an AllowedChildTypes field. Available values will be populated from the FieldSettings.
 */
export class AllowedChildTypesComponent extends Component<
  ReactClientFieldSetting & WithStyles<typeof styles>,
  AllowedChildTypesState
> {
  constructor(props: AllowedChildTypesComponent['props']) {
    super(props)
    this.state = {
      value: [],
      effectiveAllowedChildTypes: [],
      allowedTypesOnCTD: [],
      items: [],
      removeable: true,
      allCTDs: [],
      isLoading: false,
      inputValue: '',
      isOpened: false,
      anchorEl: null as any,
      getMenuItem: (item: ContentType, select: (item: ContentType) => void) => (
        <ListItem key={item.Id} value={item.Id} onClick={() => select(item)} style={{ margin: 0 }}>
          <ListItemIcon style={{ margin: 0 }}>
            {this.props.renderIcon
              ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
              : renderIconDefault(
                  item.Icon && typeicons[item.Icon.toLowerCase()]
                    ? typeicons[item.Icon.toLowerCase()]
                    : typeicons.contenttype,
                )}
          </ListItemIcon>
          <ListItemText primary={item.DisplayName} />
        </ListItem>
      ),
      filteredList: [],
      selected: null,
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClickAway = this.handleClickAway.bind(this)
    this.getAllowedChildTypes()
    this.getAllContentTypes()
  }

  /**
   * component will unmount
   */
  public componentWillUnmount() {
    this.willUnmount = true
  }

  private willUnmount = false

  private async getAllowedChildTypes() {
    try {
      if (!this.props.repository) {
        throw new Error('You must pass a repository to this control')
      }
      if (!this.props.content) {
        return
      }

      const result = await this.props.repository.load<GenericContent>({
        idOrPath: this.props.content.Id,
        oDataOptions: {
          select: ['EffectiveAllowedChildTypes'],
          expand: ['EffectiveAllowedChildTypes'],
        },
      })
      if (this.willUnmount) {
        return
      }

      const allowedChildTypesFromCTD = await this.props.repository.allowedChildTypes.getFromCTD(this.props.content.Id)

      const typeResults = result.d.EffectiveAllowedChildTypes as ContentType[]

      const types = this.getTypes(typeResults, allowedChildTypesFromCTD)

      this.setState({
        effectiveAllowedChildTypes: typeResults,
        items: types,
        removeable: typeResults.length === 0 || this.props.actionName !== 'new',
        value: types.map((t: ContentType) => t.Name),
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  private getTypes(typeResults: ContentType[], allowedChildTypesFromCTD: ODataCollectionResponse<ContentType>) {
    if (this.props.actionName === 'new') {
      return (allowedChildTypesFromCTD.d.results.length && allowedChildTypesFromCTD.d.results) || []
    }
    return typeResults.length ? typeResults : allowedChildTypesFromCTD.d.results
  }

  private async getAllContentTypes() {
    try {
      if (!this.props.repository) {
        throw new Error('You must pass a repository to this control')
      }

      const result = (await this.props.repository.executeAction({
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: 'GetAllContentTypes',
        method: 'GET',
        oDataOptions: {
          select: ['Name', 'DisplayName', 'Icon'],
        },
      })) as ODataCollectionResponse<ContentType>
      if (this.willUnmount) {
        return
      }
      this.setState({
        allCTDs: result.d.results.sort(compare),
        filteredList: result.d.results.sort(compare),
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  public handleRemove = (item: GenericContent) => {
    const { items } = this.state
    const index = items.findIndex((i) => item.Name === i.Name)
    if (items.length > 1) {
      this.setState({
        items: [...items.slice(0, index), ...items.slice(index + 1)],
      })
    } else {
      this.setState({
        items: this.state.allowedTypesOnCTD,
        removeable: false,
      })
    }
  }

  public handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const term = e.target.value
    this.setState({
      filteredList: this.state.allCTDs.filter((ctd) => {
        return ctd.DisplayName && ctd.DisplayName.toLowerCase().includes(term.toLowerCase())
      }),
      inputValue: term,
    })
    if (term.length === 0) {
      this.setState({
        selected: null,
      })
    }
  }

  private handleClickAway() {
    this.setState({ isOpened: false })
  }

  public handleSelect(item: ContentType) {
    this.setState({
      inputValue: item.DisplayName || '',
      isOpened: false,
      isLoading: false,
      selected: item,
    })
  }

  public handleOnClick = () => {
    this.setState({
      isOpened: true,
    })
  }

  public handleAddClick = () => {
    const { items, selected, value } = this.state
    const newValue = selected ? [...value, selected.Name] : value
    if (this.state.removeable) {
      this.setState({
        items: selected ? [...items, selected] : items,
        value: newValue,
        selected: null,
        inputValue: '',
        filteredList: this.state.allCTDs,
      })
    } else {
      this.setState({
        items: selected ? [selected] : [],
        value: selected ? [selected.Name] : [],
        selected: null,
        inputValue: '',
        filteredList: this.state.allCTDs,
        removeable: true,
      })
    }
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, newValue)
  }

  public render() {
    switch (this.props.actionName) {
      case 'new':
      case 'edit':
        return (
          <LocalizationContext.Consumer>
            {(localization) => (
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <>
                  <InputLabel shrink htmlFor={this.props.settings.Name} required={this.props.settings.Compulsory}>
                    {this.props.settings.DisplayName}
                  </InputLabel>

                  <List dense={true} className={this.props.classes.list}>
                    {this.state.items.map((item, index) => (
                      <ListItem key={index} style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <ListItemIcon style={{ margin: 0 }}>
                          {this.props.renderIcon
                            ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                            : renderIconDefault(
                                item.Icon && typeicons[item.Icon.toLowerCase()]
                                  ? typeicons[item.Icon.toLowerCase()]
                                  : typeicons.contenttype,
                              )}
                        </ListItemIcon>
                        <ListItemText primary={item.DisplayName} />
                        {this.state.removeable ? (
                          <ListItemSecondaryAction style={{ padding: 0 }}>
                            <IconButton aria-label="Remove" onClick={() => this.handleRemove(item)}>
                              {this.props.renderIcon ? this.props.renderIcon('delete') : renderIconDefault('delete')}
                            </IconButton>
                          </ListItemSecondaryAction>
                        ) : null}
                      </ListItem>
                    ))}
                  </List>
                  <div
                    ref={(ref: HTMLDivElement) =>
                      ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })
                    }
                    style={{ position: 'relative' }}>
                    <div className={this.props.classes.inputContainer}>
                      <TextField
                        type="text"
                        onClick={this.handleOnClick}
                        onChange={this.handleInputChange}
                        placeholder={localization.values.forms.inputPlaceHolder}
                        InputProps={{
                          endAdornment: this.state.isLoading ? (
                            <InputAdornment position="end">
                              <CircularProgress size={16} />
                            </InputAdornment>
                          ) : null,
                        }}
                        fullWidth={true}
                        value={this.state.inputValue}
                        className={this.props.classes.input}
                      />
                      <IconButton
                        color={'primary'}
                        style={{ padding: 0, height: '24px', width: '24px' }}
                        disabled={this.state.selected && this.state.selected.Name.length > 0 ? false : true}
                        onClick={this.handleAddClick}>
                        {this.props.renderIcon ? this.props.renderIcon('add_circle') : renderIconDefault('add_circle')}
                      </IconButton>
                    </div>
                    <Paper
                      className={clsx(this.props.classes.listContainer, {
                        [this.props.classes.listContainer]: this.state.isOpened,
                        [this.props.classes.ddIsClosed]: !this.state.isOpened,
                      })}>
                      <List>
                        {this.state.filteredList.length > 0 ? (
                          this.state.filteredList.map((item: any) => this.state.getMenuItem(item, this.handleSelect))
                        ) : (
                          <ListItem>No hits</ListItem>
                        )}
                      </List>
                    </Paper>
                  </div>
                </>
              </ClickAwayListener>
            )}
          </LocalizationContext.Consumer>
        )
      case 'browse':
      default:
        return this.state.items.length ? (
          <>
            <InputLabel shrink htmlFor={this.props.settings.Name} required={this.props.settings.Compulsory}>
              {this.props.settings.DisplayName}
            </InputLabel>
            <FormControl>
              <List dense={true}>
                {this.state.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon style={{ margin: 0 }}>
                      {this.props.renderIcon
                        ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                        : renderIconDefault(
                            item.Icon && typeicons[item.Icon.toLowerCase()]
                              ? typeicons[item.Icon.toLowerCase()]
                              : typeicons.contenttype,
                          )}
                    </ListItemIcon>
                    <ListItemText primary={item.DisplayName} />
                  </ListItem>
                ))}
              </List>
            </FormControl>
          </>
        ) : (
          <InputLabel shrink htmlFor={this.props.settings.Name} required={this.props.settings.Compulsory}>
            {this.props.settings.DisplayName}
          </InputLabel>
        )
    }
  }
}

export const AllowedChildTypes = withStyles(styles)(AllowedChildTypesComponent)
