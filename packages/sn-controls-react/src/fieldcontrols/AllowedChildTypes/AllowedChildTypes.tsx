import CircularProgress from '@material-ui/core/CircularProgress'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormLabel from '@material-ui/core/FormLabel'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import DeleteIcon from '@material-ui/icons/Delete'
import { GenericContent } from '@sensenet/default-content-types'
import { MaterialIcon } from '@sensenet/icons-react'
import Radium from 'radium'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactAllowedChildTypesFieldSetting } from './AllowedChildTypesFieldSettings'

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
  },
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
  value: string
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
      value: this.setValue(this.props['data-fieldValue']).toString(),
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
        <MenuItem key={item.Id} value={item.Id} onClick={() => select(item)}>
          {item.DisplayName}
        </MenuItem>
      ),
      filteredList: [],
    }
    this.handleChange = this.handleChange.bind(this)
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
          result.d.EffectiveAllowedChildTypes.length === 0
            ? // tslint:disable-next-line: no-string-literal
              allowedChildTypesFromCTD['d'].results
            : result.d.EffectiveAllowedChildTypes,
        removeable: result.d.EffectiveAllowedChildTypes.length === 0 ? false : true,
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
        allCTDs: result.d.results,
      })
    } catch (_e) {
      console.log(_e)
    }
  }
  public handleRemove = (item: GenericContent) => {
    const { items } = this.state
    const index = items.findIndex(i => item.Name === i.Name)
    this.setState({
      items: [...items.slice(0, index), ...items.slice(index + 1)],
    })
  }
  //     private async addAllowedChildTypes = (types: string[]) => {
  //     console.log(types)
  // }
  //     private async removeAllowedChildTypes = (types: string[]) => {
  //     console.log(types)
  // }
  /**
   * handle change event on an input
   * @param {SytheticEvent} event
   */
  public handleChange(color: any) {
    this.props.onChange(this.props.name, color.hex)
    this.setState({ value: color.hex })
  }
  public handleInputChange = (e: React.ChangeEvent) => {
    // tslint:disable-next-line: no-string-literal
    const term = e.target['value']
    this.setState({
      filteredList: this.state.allCTDs.filter(ctd => {
        // if (ctd.DisplayName && ctd.DisplayName.toLowerCase().includes(term)) {
        //     console.log(ctd.DisplayName.toLowerCase())
        //     console.log(term)
        // }
        return ctd.DisplayName && ctd.DisplayName.toLowerCase().includes(term.toLowerCase())
      }),
      inputValue: term,
    })
  }
  private handleClickAway() {
    this.setState({ isOpened: false })
  }
  private handleSelect(item: T) {
    this.setState({
      inputValue: item.DisplayName || '',
      isOpened: false,
      isLoading: false,
    })
  }
  private handleOnClick = () => {
    this.setState({
      isOpened: true,
    })
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
                  <ListItemIcon>
                    <MaterialIcon
                      iconName={
                        item.Icon
                          ? item.Icon === 'Document'
                            ? 'insert_drive_file'
                            : item.Icon.toLowerCase()
                          : item.Name.toLowerCase()
                      }
                    />
                  </ListItemIcon>
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
                <IconButton style={styles.button}>
                  <MaterialIcon iconName="add" />
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
            <TextField
              type="text"
              name={this.props.name as string}
              id={this.props.name as string}
              label={
                this.props['data-errorText'] && this.props['data-errorText'].length > 0
                  ? this.props['data-errorText']
                  : this.props['data-labelText']
              }
              className={this.props.className}
              required={this.props.required}
              disabled={this.props.readOnly}
              error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
            />
            <FormHelperText>{this.props['data-hintText']}</FormHelperText>
            <FormHelperText>{this.props['data-errorText']}</FormHelperText>
          </FormControl>
        )
      case 'browse':
        return (
          <FormControl className={this.props.className}>
            <TextField
              type="text"
              name={this.props.name as string}
              id={this.props.name as string}
              label={
                this.props['data-errorText'] && this.props['data-errorText'].length > 0
                  ? this.props['data-errorText']
                  : this.props['data-labelText']
              }
              className={this.props.className}
              disabled={true}
              value={this.state.value}
            />
          </FormControl>
        )
      default:
        return (
          <div>
            <label>{this.props['data-labelText']}</label>
          </div>
        )
    }
  }
}
