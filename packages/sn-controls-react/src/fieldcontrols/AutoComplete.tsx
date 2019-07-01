import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import debounce from 'lodash.debounce'
import React, { Component } from 'react'
import { ReactClientFieldSetting } from './ClientFieldSetting'

/**
 * State object for the AutoComplete component
 */
export interface AutoCompleteState {
  inputValue: string
  isLoading: boolean
  isOpened: boolean
  term?: string
  items: GenericContent[]
  selected?: GenericContent[]
  anchorEl: HTMLElement
}

/**
 * Field control that represents a AutoComplete field. Available values will be populated from the FieldSettings.
 */
export class AutoComplete extends Component<ReactClientFieldSetting<ReferenceFieldSetting>, AutoCompleteState> {
  /**
   * state initialization
   */
  public state: AutoCompleteState = {
    inputValue: this.props.content && this.props.content[this.props.settings.Name][0].DisplayName,
    isOpened: false,
    isLoading: false,
    selected: this.props.content && this.props.content[this.props.settings.Name],
    anchorEl: null as any,
    items: [],
  }
  private willUnmount: boolean = false
  /**
   * component will unmount
   */
  public componentWillUnmount() {
    this.willUnmount = true
  }

  constructor(props: AutoComplete['props']) {
    super(props)
    const handleInputChange = this.handleInputChange.bind(this)
    this.handleInputChange = debounce(handleInputChange, 500)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClickAway = this.handleClickAway.bind(this)
  }

  private async handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {
    const term = `*${e.target.value}*`
    const query = new Query(q => q.query(q2 => q2.equals('Name', term).or.equals('DisplayName', term)))

    new QueryOperators(query).and.query(q2 => {
      this.props.settings.AllowedTypes &&
        this.props.settings.AllowedTypes.map((allowedType, index, array) => {
          new QueryExpression(q2.queryRef).term(`TypeIs:${allowedType}`)
          if (index < array.length - 1) {
            return new QueryOperators(q2.queryRef).or
          }
        })
      return q2
    })

    new QueryOperators(query).and.query(q2 => {
      this.props.settings.SelectionRoots &&
        this.props.settings.SelectionRoots.forEach((root, index, array) => {
          new QueryExpression(q2.queryRef).inTree(root)
          if (index < array.length - 1) {
            return new QueryOperators(q2.queryRef).or
          }
        })
      return q2
    })

    this.setState({
      isLoading: true,
    })
    if (!this.props.repository) {
      throw new Error('You must pass a repository to this control')
    }
    try {
      const values = await this.props.repository.loadCollection({
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
    } catch (_e) {
      /** */
    } finally {
      !this.willUnmount && this.setState({ isLoading: false })
    }
  }

  private handleClickAway() {
    this.setState({ isOpened: false })
  }

  private handleSelect(item: GenericContent) {
    this.setState({
      inputValue: item.DisplayName || '',
      selected: [item],
      isOpened: false,
      isLoading: false,
    })
    this.props.fieldOnChange && this.props.fieldOnChange(this.props.settings.Name, item.Id)
  }

  public render() {
    switch (this.props.actionName) {
      case 'edit':
      case 'new':
        return (
          <div ref={ref => ref && this.state.anchorEl !== ref && this.setState({ anchorEl: ref })}>
            <FormControl
              key={this.props.settings.Name}
              component={'fieldset' as 'div'}
              required={this.props.settings.Compulsory}>
              <TextField
                value={this.state.inputValue}
                type="text"
                onChange={async e => {
                  this.setState({ inputValue: e.target.value })
                  e.persist()
                  await this.handleInputChange(e)
                }}
                autoFocus={true}
                label={this.props.settings.DisplayName}
                placeholder={this.props.settings.DisplayName}
                InputProps={{
                  endAdornment: this.state.isLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null,
                }}
                name={this.props.settings.Name}
                id={this.props.settings.Name}
                required={this.props.settings.Compulsory}
                disabled={this.props.settings.ReadOnly}
                fullWidth={true}
                helperText={this.props.settings.Description}
              />
              <Menu
                BackdropProps={{
                  onClick: this.handleClickAway,
                  style: { background: 'none' },
                }}
                autoFocus={false}
                open={this.state.isOpened}
                anchorEl={this.state.anchorEl}
                PaperProps={{
                  style: {
                    marginTop: '45px',
                    minWidth: '250px',
                  },
                }}>
                {this.state.items.length > 0 ? (
                  this.state.items.map(item => (
                    <MenuItem key={item.Id} value={item.Id} onClick={() => this.handleSelect(item)}>
                      {item.DisplayName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>No hits</MenuItem>
                )}
              </Menu>
            </FormControl>
          </div>
        )
      case 'browse':
      default: {
        const value = this.props.content && this.props.content[this.props.settings.Name]
        return value ? (
          <FormControl component={'fieldset' as 'div'}>
            <FormLabel component={'legend' as 'label'}>{this.props.settings.DisplayName}</FormLabel>
            <FormGroup>
              {Array.isArray(value) ? (
                value.map((val: GenericContent) => (
                  <FormControl component={'fieldset' as 'div'} key={val.Id}>
                    <FormControlLabel style={{ marginLeft: 0 }} label={val.DisplayName} control={<span />} />
                  </FormControl>
                ))
              ) : (
                <FormControl component={'fieldset' as 'div'}>
                  <FormControlLabel style={{ marginLeft: 0 }} label={value.DisplayName} control={<span />} />
                </FormControl>
              )}
            </FormGroup>
          </FormControl>
        ) : null
      }
    }
  }
}
