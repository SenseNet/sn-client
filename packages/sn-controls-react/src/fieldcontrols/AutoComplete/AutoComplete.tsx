import { CircularProgress, InputAdornment, Menu, MenuItem, TextField } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import { GenericContent } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import debounce from 'lodash.debounce'
import React, { Component } from 'react'
import { ReactClientFieldSetting, ReactClientFieldSettingProps } from '../ClientFieldSetting'
import { ReactReferenceFieldSetting } from '../ReferenceFieldSetting'

/**
 * Interface for AutoComplete properties
 */
export interface AutoCompleteProps<T extends GenericContent, K extends keyof T>
  extends ReactClientFieldSettingProps<T, K>,
    ReactClientFieldSetting<T, K>,
    ReactReferenceFieldSetting<T, K> {}

/**
 * State object for the AutoComplete component
 */
export interface AutoCompleteState<T extends GenericContent> {
  inputValue: string
  isLoading: boolean
  isOpened: boolean
  term?: string
  items: T[]
  selected: number | number[] | null
  anchorEl: HTMLElement
  getMenuItem: (item: T, select: (item: T) => void) => JSX.Element
}

/**
 * Field control that represents a AutoComplete field. Available values will be populated from the FieldSettings.
 */
export class AutoComplete<T extends GenericContent = GenericContent, K extends keyof T = 'Name'> extends Component<
  AutoCompleteProps<T, K>,
  AutoCompleteState<T>
> {
  /**
   * returns a content by its id
   */
  public getContentById = (id: number) => {
    return this.props.dataSource ? this.props.dataSource.find(item => item.Id === id) : null
  }
  /**
   * state initialization
   */
  public state = {
    inputValue: '',
    isOpened: false,
    isLoading: false,
    items: this.props.dataSource || [],
    selected: this.props['data-fieldValue'] || [],
    anchorEl: null as any,
    getMenuItem: (item: T, select: (item: T) => void) => (
      <MenuItem key={item.Id} value={item.Id} onClick={() => select(item)}>
        {item.DisplayName}
      </MenuItem>
    ),
  }
  private willUnmount: boolean = false
  /**
   * component will unmount
   */
  public componentWillUnmount() {
    this.willUnmount = true
  }
  constructor(props: AutoComplete['props']) {
    super(props as any)
    const handleInputChange = this.handleInputChange.bind(this)
    this.handleInputChange = debounce(handleInputChange, 350)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClickAway = this.handleClickAway.bind(this)
  }
  private async handleInputChange(e: React.ChangeEvent) {
    // tslint:disable
    const term = `*${e.target['value']}*`
    const query = new Query(q => q.query(q2 => q2.equals('Name', term).or.equals('DisplayName', term)))

    if (this.props['data-allowedTypes']) {
      new QueryOperators(query).and.query(q2 => {
        ;(this.props['data-allowedTypes'] as string[]).map((allowedType, index, array) => {
          new QueryExpression(q2['queryRef']).term(`TypeIs:${allowedType}`)
          if (index < array.length - 1) {
            new QueryOperators(q2['queryRef']).or
          }
        })
        return q2
      })
    }

    if (this.props['data-selectionRoot'] && this.props['data-selectionRoot'].length) {
      new QueryOperators(query).and.query(q2 => {
        ;(this.props['data-selectionRoot'] as string[]).forEach((root, index, array) => {
          new QueryExpression(q2['queryRef']).inTree(root)
          if (index < array.length - 1) {
            new QueryOperators(q2['queryRef']).or
          }
        })
        return q2
      })
      // tslint:enable
    }

    this.setState({
      isLoading: true,
      // inputValue: [e.target.value],
    })
    if (this.props.dataSource && this.props.dataSource.length > 0) {
      this.setState({
        items: this.props.dataSource,
        isOpened: this.props.dataSource.length > 0 ? true : false,
      })
    } else {
      try {
        const values = await this.props.repository.loadCollection<T>({
          path: '/Root',
          oDataOptions: {
            query: query.toString(),
            select: 'all',
          },
        })
        if (this.willUnmount) {
          return
        }
        this.setState({
          items: values.d.results,
          isOpened: values.d.results.length > 0 ? true : false,
        })

        // tslint:disable-next-line:variable-name
      } catch (_e) {
        /** */
      } finally {
        !this.willUnmount && this.setState({ isLoading: false })
      }
    }
  }

  private handleClickAway() {
    this.setState({ isOpened: false })
  }

  private handleSelect(item: T) {
    this.setState({
      inputValue: '',
      selected: [item.Id],
      isOpened: false,
      isLoading: false,
    })
    const { name, onChange } = this.props
    onChange(name, item.Id as any)
  }
  /**
   * render
   * @return {ReactElement} markup
   */
  public render() {
    const displayName = this.props['data-defaultDisplayName'] || 'DisplayName'
    switch (this.props['data-actionName']) {
      case 'edit':
      case 'new':
        return (
          <div ref={ref => ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })}>
            <FormControl
              className={this.props.className}
              key={this.props.name as string}
              // Issue in type checking in 3.2 https://github.com/mui-org/material-ui/issues/13744
              component={"fieldset" as "div"}
              required={this.props.required}>
              <TextField
                value={this.state.selected.length > 0 ? this.getContentById(this.state.selected[0])[displayName] : ''}
                type="text"
                onChange={async e => {
                  // tslint:disable-next-line:no-string-literal
                  this.setState({ inputValue: e.target['value'] })
                  e.persist()
                  await this.handleInputChange(e)
                }}
                autoFocus={true}
                label={
                  this.props['data-errorText'] && this.props['data-errorText'].length > 0
                    ? this.props['data-errorText']
                    : this.props['data-labelText']
                }
                placeholder={this.props['data-placeHolderText']}
                InputProps={{
                  endAdornment: this.state.isLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null,
                }}
                name={this.props.name as string}
                id={this.props.name as string}
                className={this.props.className}
                style={this.props.style}
                required={this.props.required}
                disabled={this.props.readOnly}
                error={this.props['data-errorText'] && this.props['data-errorText'].length > 0 ? true : false}
                fullWidth={true}
                helperText={this.props['data-hintText']}
              />
              <Menu
                BackdropProps={{
                  onClick: this.handleClickAway,
                  style: { background: 'none' },
                }}
                open={this.state.isOpened}
                anchorEl={this.state.anchorEl}
                PaperProps={{
                  style: {
                    marginTop: '45px',
                    minWidth: '250px',
                  },
                }}>
                {this.state.items.length > 0 ? (
                  this.state.items.map((item: any) => this.state.getMenuItem(item, this.handleSelect))
                ) : (
                  <MenuItem>No hits</MenuItem>
                )}
              </Menu>
            </FormControl>
          </div>
        )
      case 'browse':
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={"fieldset" as "div"} className={this.props.className}>
            <FormLabel component={"legend" as "label"}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: T[K]) => (
                <FormControl component={"fieldset" as "div"}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.state.items.find((item: any) => item.Id === value)[displayName]}
                    control={<span />}
                    key={this.state.items.find(item => item.Id === value).Name}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
      default:
        return this.props['data-fieldValue'].length > 0 ? (
          <FormControl component={"fieldset" as "div"} className={this.props.className}>
            <FormLabel component={"legend" as "label"}>{this.props['data-labelText']}</FormLabel>
            <FormGroup>
              {this.props['data-fieldValue'].map((value: T[K]) => (
                <FormControl component={"fieldset" as "div"}>
                  <FormControlLabel
                    style={{ marginLeft: 0 }}
                    label={this.state.items.find((item: any) => item.Id === value)[displayName]}
                    control={<span />}
                    key={this.state.items.find(item => item.Id === value).Name}
                  />
                </FormControl>
              ))}
            </FormGroup>
          </FormControl>
        ) : null
    }
  }
}
