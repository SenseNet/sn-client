import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import { GenericContent } from '@sensenet/default-content-types'
import Radium from 'radium'
import React, { Component } from 'react'
import { typeicons } from '../../assets/icons'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactAllowedChildTypesFieldSetting } from './AllowedChildTypesFieldSettings'

const renderIconDefault = (name: string) => {
  return <Icon>{name}</Icon>
}

const INPUT_PLACEHOLDER = 'Start typing to add another type'
const ITEM_HEIGHT = 48

const styles = {
  inputContainer: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: 'none',
    position: 'relative',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  button: {
    padding: 10,
  },
  listContainer: {
    position: 'absolute',
    top: '40px',
    background: '#fff',
    maxHeight: ITEM_HEIGHT * 2.5,
    overflow: 'auto',
    boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)',
    zIndex: 10,
  },
}

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
 * Interface for AllowedChildTypes properties
 */
export interface AllowedChildTypesProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactAllowedChildTypesFieldSetting<T, K> {}
/**
 * Interface for Password state
 */
export interface AllowedChildTypesState<T extends GenericContent> {
  value: string[]
  effectiveAllowedChildTypes: T[]
  allowedTypesOnCTD: T[]
  items: T[]
  removeable: boolean
  allCTDs: T[]
  isLoading: boolean
  inputValue: string
  isOpened: boolean
  anchorEl: HTMLElement
  getMenuItem: (item: T, select: (item: T) => void) => JSX.Element
  filteredList: T[]
  selected: T | null
}
/**
 * Field control that represents a Color field. Available values will be populated from the FieldSettings.
 */
@Radium
export class AllowedChildTypes<T extends GenericContent, K extends keyof T> extends Component<
  AllowedChildTypesProps<T, K>,
  AllowedChildTypesState<T>
> {
  /**
   * constructor
   * @param {object} props
   */
  constructor(props: AllowedChildTypesProps<T, K>) {
    super(props)
    /**
     * @type {object}
     * @property {string} value input value
     */
    this.state = {
      value: this.setValue(this.props['data-fieldValue']) as string[],
      effectiveAllowedChildTypes: [],
      allowedTypesOnCTD: [],
      items: [],
      removeable: true,
      allCTDs: [],
      isLoading: false,
      inputValue: '',
      isOpened: false,
      anchorEl: null as any,
      // tslint:disable-next-line: no-unnecessary-type-annotation
      getMenuItem: (item: T, select: (item: T) => void) => (
        <ListItem key={item.Id} value={item.Id} onClick={() => select(item)} style={{ margin: 0 }}>
          <ListItemIcon
            style={{ margin: 0 }}
            children={
              this.props.renderIcon
                ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                : renderIconDefault(
                    item.Icon && typeicons[item.Icon.toLowerCase()]
                      ? typeicons[item.Icon.toLowerCase()]
                      : // tslint:disable-next-line: no-string-literal
                        typeicons['contenttype'],
                  )
            }
          />
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
   * convert incoming default value string to proper format
   * @param {string} value
   */
  public setValue(value: string) {
    if (value && value.length > 0) {
      return value
    } else {
      if (this.props['data-defaultValue']) {
        return this.props['data-defaultValue']
      } else {
        return []
      }
    }
  }
  private willUnmount: boolean = false
  private async getAllowedChildTypes() {
    try {
      const result = await this.props['data-repository'].load<T>({
        // tslint:disable-next-line: no-string-literal
        idOrPath: this.props['content'].Id,
        oDataOptions: {
          select: 'EffectiveAllowedChildTypes',
          expand: 'EffectiveAllowedChildTypes',
        },
      })
      if (this.willUnmount) {
        return
      }

      const allowedChildTypesFromCTD = await this.props['data-repository'].executeAction({
        // tslint:disable-next-line: no-string-literal
        idOrPath: this.props['content'].Id,
        name: 'GetAllowedChildTypesFromCTD',
        method: 'GET',
        body: {
          select: ['Name', 'DisplayName', 'Icon'],
        },
      })

      this.setState({
        effectiveAllowedChildTypes: result.d.EffectiveAllowedChildTypes,
        // tslint:disable-next-line: no-string-literal
        allowedTypesOnCTD: allowedChildTypesFromCTD['d'].results,
        // tslint:disable-next-line: no-string-literal
        items:
          this.props['data-actionName'] !== 'new'
            ? result.d.EffectiveAllowedChildTypes.length === 0
              ? // tslint:disable-next-line: no-string-literal
                allowedChildTypesFromCTD['d'].results
              : result.d.EffectiveAllowedChildTypes
            : // tslint:disable-next-line: no-string-literal
              allowedChildTypesFromCTD['d'].results,
        removeable:
          result.d.EffectiveAllowedChildTypes.length === 0 || this.props['data-actionName'] === 'new' ? false : true,
      })
    } catch (_e) {
      console.log(_e)
    }
  }
  private async getAllContentTypes() {
    try {
      const result = await this.props['data-repository'].executeAction({
        // tslint:disable-next-line: no-string-literal
        idOrPath: this.props['content'].Id,
        name: 'GetAllContentTypes',
        method: 'GET',
        oDataOptions: {
          select: ['Name', 'DisplayName', 'Icon'],
        },
      })
      if (this.willUnmount) {
        return
      }
      this.setState({
        allCTDs: result.d.results.sort(compare),
        filteredList: result.d.results.sort(compare),
      })
    } catch (_e) {
      console.log(_e)
    }
  }
  public handleRemove = (item: GenericContent) => {
    const { items } = this.state
    const index = items.findIndex(i => item.Name === i.Name)
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
  public handleInputChange = (e: React.ChangeEvent) => {
    // tslint:disable-next-line: no-string-literal
    const term = e.target['value']
    this.setState({
      filteredList: this.state.allCTDs.filter(ctd => {
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
  private handleSelect(item: T) {
    this.setState({
      inputValue: item.DisplayName || '',
      isOpened: false,
      isLoading: false,
      selected: item,
    })
  }
  private handleOnClick = () => {
    this.setState({
      isOpened: true,
    })
  }
  private handleAddClick = () => {
    const { items, selected, value } = this.state
    if (this.state.removeable) {
      this.setState({
        items: selected ? [...items, selected] : items,
        value: selected ? [...value, selected.Name] : value,
        selected: null,
        inputValue: '',
        filteredList: [],
      })
    } else {
      this.setState({
        items: selected ? [selected] : [],
        value: selected ? [selected.Name] : [],
        selected: null,
        inputValue: '',
        filteredList: [],
        removeable: true,
      })
    }
    this.props.onChange(this.props.name, value as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    switch (this.props['data-actionName']) {
      case 'edit':
        return (
          <FormControl className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <List dense={true}>
              {this.state.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon
                    style={{ margin: 0 }}
                    children={
                      this.props.renderIcon
                        ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                        : renderIconDefault(
                            item.Icon && typeicons[item.Icon.toLowerCase()]
                              ? typeicons[item.Icon.toLowerCase()]
                              : // tslint:disable-next-line: no-string-literal
                                typeicons['contenttype'],
                          )
                    }
                  />
                  <ListItemText primary={item.DisplayName} />
                  {this.state.removeable ? (
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Remove" onClick={() => this.handleRemove(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : null}
                </ListItem>
              ))}
            </List>
            <div
              ref={(ref: HTMLDivElement) => ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })}
              style={{ position: 'relative' }}>
              <Paper style={styles.inputContainer as any} elevation={0}>
                <TextField
                  type="text"
                  onClick={this.handleOnClick}
                  onChange={e => {
                    this.handleInputChange(e)
                  }}
                  placeholder={INPUT_PLACEHOLDER}
                  InputProps={{
                    endAdornment: this.state.isLoading ? (
                      <InputAdornment position="end">
                        <CircularProgress size={16} />
                      </InputAdornment>
                    ) : null,
                  }}
                  fullWidth={true}
                  value={this.state.inputValue}
                  style={styles.input}
                />
                <IconButton
                  style={styles.button}
                  disabled={this.state.selected && this.state.selected.Name.length > 0 ? false : true}
                  onClick={this.handleAddClick}>
                  {this.props.renderIcon ? this.props.renderIcon('add') : renderIconDefault('add')}
                </IconButton>
              </Paper>
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <List
                  style={{ ...{ display: this.state.isOpened ? 'block' : 'none' }, ...(styles.listContainer as any) }}>
                  {this.state.filteredList.length > 0 ? (
                    this.state.filteredList.map((item: any) => this.state.getMenuItem(item, this.handleSelect))
                  ) : (
                    <ListItem>No hits</ListItem>
                  )}
                </List>
              </ClickAwayListener>
              <FormHelperText>{this.props['data-hintText']}</FormHelperText>
              <FormHelperText>{this.props['data-errorText']}</FormHelperText>
            </div>
          </FormControl>
        )
      case 'new':
        return (
          <FormControl className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <List dense={true}>
              {this.state.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon
                    style={{ margin: 0 }}
                    children={
                      this.props.renderIcon
                        ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                        : renderIconDefault(
                            item.Icon && typeicons[item.Icon.toLowerCase()]
                              ? typeicons[item.Icon.toLowerCase()]
                              : // tslint:disable-next-line: no-string-literal
                                typeicons['contenttype'],
                          )
                    }
                  />
                  <ListItemText primary={item.DisplayName} />
                  {this.state.removeable ? (
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Remove" onClick={() => this.handleRemove(item)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  ) : null}
                </ListItem>
              ))}
            </List>
            <div
              ref={(ref: HTMLDivElement) => ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })}
              style={{ position: 'relative' }}>
              <Paper style={styles.inputContainer as any} elevation={0}>
                <TextField
                  type="text"
                  onClick={this.handleOnClick}
                  onChange={e => {
                    this.handleInputChange(e)
                  }}
                  placeholder={INPUT_PLACEHOLDER}
                  InputProps={{
                    endAdornment: this.state.isLoading ? (
                      <InputAdornment position="end">
                        <CircularProgress size={16} />
                      </InputAdornment>
                    ) : null,
                  }}
                  fullWidth={true}
                  value={this.state.inputValue}
                  style={styles.input}
                />
                <IconButton
                  style={styles.button}
                  disabled={this.state.selected && this.state.selected.Name.length > 0 ? false : true}
                  onClick={this.handleAddClick}>
                  {this.props.renderIcon ? this.props.renderIcon('add') : renderIconDefault('add')}
                </IconButton>
              </Paper>
              <ClickAwayListener onClickAway={this.handleClickAway}>
                <List
                  style={{ ...{ display: this.state.isOpened ? 'block' : 'none' }, ...(styles.listContainer as any) }}>
                  {this.state.filteredList.length > 0 ? (
                    this.state.filteredList.map((item: any) => this.state.getMenuItem(item, this.handleSelect))
                  ) : (
                    <ListItem>No hits</ListItem>
                  )}
                </List>
              </ClickAwayListener>
              <FormHelperText>{this.props['data-hintText']}</FormHelperText>
              <FormHelperText>{this.props['data-errorText']}</FormHelperText>
            </div>
          </FormControl>
        )
      case 'browse':
        return (
          <FormControl className={this.props.className}>
            <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
            <List dense={true}>
              {this.state.items.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon
                    style={{ margin: 0 }}
                    children={
                      this.props.renderIcon
                        ? this.props.renderIcon(item.Icon ? item.Icon.toLowerCase() : 'contenttype')
                        : renderIconDefault(
                            item.Icon && typeicons[item.Icon.toLowerCase()]
                              ? typeicons[item.Icon.toLowerCase()]
                              : // tslint:disable-next-line: no-string-literal
                                typeicons['contenttype'],
                          )
                    }
                  />
                  <ListItemText primary={item.DisplayName} />
                </ListItem>
              ))}
            </List>
          </FormControl>
        )
      default:
        return (
          <div>
            <FormControl className={this.props.className}>
              <FormLabel component={'legend' as 'label'}>{this.props['data-labelText']}</FormLabel>
              <List dense={true}>
                {this.state.items.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {this.props.renderIcon
                        ? this.props.renderIcon(item.Icon ? this.props.icons[item.Icon.toLowerCase()] : 'file')
                        : renderIconDefault(item.Icon ? this.props.icons[item.Icon.toLowerCase()] : 'file')}
                    </ListItemIcon>
                    <ListItemText primary={item.DisplayName} />
                  </ListItem>
                ))}
              </List>
            </FormControl>
          </div>
        )
    }
  }
}
