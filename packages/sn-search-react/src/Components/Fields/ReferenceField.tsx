import { ListItemText } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { debounce } from '@sensenet/client-utils'
import { GenericContent, ReferenceFieldSetting } from '@sensenet/default-content-types'
import { Query, QueryExpression, QueryOperators } from '@sensenet/query'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import React from 'react'
import Autosuggest, {
  GetSuggestionValue,
  InputProps,
  OnSuggestionSelected,
  RenderInputComponent,
  RenderSuggestion,
} from 'react-autosuggest'

/**
 * Props for the ReferenceField component
 */
export interface ReferenceFieldProps<T> {
  label?: string
  helperText?: string
  fieldName: keyof T
  fieldKey?: string
  fieldSetting: ReferenceFieldSetting
  defaultValueIdOrPath?: string | number
  fetchItems: (fetchQuery: Query<T>) => Promise<T[]>
  onQueryChange: (key: string, query: Query<T>) => void
  renderSuggestion?: RenderSuggestion<T>
}

/**
 * State object for the ReferenceField component
 */
export interface ReferenceFieldState<T extends GenericContent> {
  inputValue: string
  items: T[]
  selected: T | null
  renderSuggestion: RenderSuggestion<T>
}

/**
 * Reference field picker component
 */
export class ReferenceField<T extends GenericContent = GenericContent> extends React.Component<
  ReferenceFieldProps<T>,
  ReferenceFieldState<T>
> {
  /**
   *
   */
  constructor(props: ReferenceField<T>['props']) {
    super(props)
    this.handleSelect = this.handleSelect.bind(this)
    this.fetchItems = debounce(this.fetchItems.bind(this), 500)
    this.onChange = this.onChange.bind(this)
  }

  private getMatchParts(text: string, term: string) {
    const matchValue = match(term, text)
    const parseValue = parse(term, matchValue)

    return parseValue.map((part, index) =>
      part.highlight ? <strong key={String(index)}>{part.text}</strong> : <span key={String(index)}>{part.text}</span>,
    )
  }

  /**
   * Initial state
   */
  public state: ReferenceFieldState<T> = {
    inputValue: '',
    items: [],
    selected: null,
    renderSuggestion: (item, { query, isHighlighted }) => {
      const primary = this.getMatchParts(query, item.DisplayName || item.Name)
      const secondary = this.getMatchParts(query, item.Path)
      return (
        <ListItem key={item.Id} selected={isHighlighted} component="div" value={item.Id}>
          <ListItemText primary={primary} secondary={secondary} />
        </ListItem>
      )
    },
  }

  public onChange = (inputValue: string) => {
    this.setState({ inputValue })
    this.fetchItems(this.getQueryFromTerm(`*${inputValue}*`))
  }

  public async fetchItems(query: Query<T>) {
    const items = await this.props.fetchItems(query)
    this.setState({ items })
  }

  public renderInputComponent: RenderInputComponent<T> = (inputProps: InputProps<T>) => {
    const {
      classes,
      inputRef = () => {
        /** */
      },
      ref,
      defaultValue,
      onChange,
      displayName,
      name,
      description,
      helperText,
      ...other
    } = inputProps

    return (
      <TextField
        type="text"
        label={displayName}
        placeholder={displayName}
        title={description}
        helperText={helperText}
        InputProps={{
          inputRef: node => {
            ref(node)
            inputRef(node)
          },
        }}
        value={this.state.inputValue}
        onChange={ev => this.onChange(ev.target.value)}
        {...other}
      />
    )
  }
  public getSuggestionValue: GetSuggestionValue<T> = c => {
    return c.DisplayName || c.Name
  }
  public onSuggestionSelected: OnSuggestionSelected<T> = (_ev, data) => {
    _ev.preventDefault()
    this.handleSelect(data.suggestion)
  }

  public async componentDidMount() {
    if (this.props.defaultValueIdOrPath) {
      const items = await this.props.fetchItems(
        new Query(q =>
          isNaN(this.props.defaultValueIdOrPath as number)
            ? q.equals('Path', this.props.defaultValueIdOrPath)
            : q.equals('Id', this.props.defaultValueIdOrPath),
        ),
      )
      if (items.length === 1 && items[0]) {
        const item = items[0]
        this.setState({
          inputValue: item.DisplayName || item.Name,
          selected: item,
        })
        this.props.onQueryChange(
          this.props.fieldKey || this.props.fieldName.toString(),
          new Query(q => q.equals(this.props.fieldName, item.Id)),
        )
      }
    }
  }

  public getQueryFromTerm<TQueryReturns>(term: string) {
    // tslint:disable
    const query = new Query<TQueryReturns>(q =>
      q.query(q2 =>
        q2
          .equals('Name', term)
          .or.equals('DisplayName', term)
          .or.equals('Path', term),
      ),
    )

    if (this.props.fieldSetting.AllowedTypes) {
      new QueryOperators(query).and.query(q2 => {
        ;(this.props.fieldSetting.AllowedTypes as string[]).map((allowedType, index, array) => {
          new QueryExpression(q2['queryRef']).term(`TypeIs:${allowedType}`)
          if (index < array.length - 1) {
            new QueryOperators(q2['queryRef']).or
          }
        })
        return q2
      })
    }

    if (this.props.fieldSetting.SelectionRoots && this.props.fieldSetting.SelectionRoots.length) {
      new QueryOperators(query).and.query(q2 => {
        ;(this.props.fieldSetting.SelectionRoots as string[]).forEach((root, index, array) => {
          new QueryExpression(q2['queryRef']).inTree(root)
          if (index < array.length - 1) {
            new QueryOperators(q2['queryRef']).or
          }
        })
        return q2
      })
    }
    return query
    // tslint:enable
  }

  private handleSelect(item: T) {
    this.setState({
      inputValue: item.DisplayName || item.Name,
      selected: item,
    })
    this.props.onQueryChange(
      this.props.fieldKey || this.props.fieldName.toString(),
      new Query(q => q.equals(this.props.fieldName, item.Id)),
    )
  }

  /**
   * Renders the component
   */
  public render() {
    const displayName = (this.props.fieldSetting && this.props.fieldSetting.DisplayName) || this.props.label
    const description = (this.props.fieldSetting && this.props.fieldSetting.Description) || ''
    const helperText = this.props.helperText || (this.props.fieldSetting && this.props.fieldSetting.Description) || ''
    const inputProps: InputProps<T> = {
      value: this.state.inputValue,
      onChange: ev => this.onChange((ev.target as HTMLInputElement).value),
      id: 'CommandBoxInput',
      displayName,
      description,
      helperText,
    }

    return (
      <Autosuggest
        theme={{
          suggestionsList: {
            listStyle: 'none',
            margin: 0,
            padding: 0,
          },
        }}
        suggestions={this.state.items}
        onSuggestionsFetchRequested={async req => {
          const query = this.getQueryFromTerm<T>(`*${req.value}*`)
          const items = await this.props.fetchItems(query)
          this.setState({ items })
        }}
        onSuggestionsClearRequested={() => {
          this.setState({ items: [] })
        }}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.state.renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        renderSuggestionsContainer={options => (
          <Paper
            square={true}
            style={{
              position: 'fixed',
              zIndex: 1,
            }}>
            <List component="nav" {...options.containerProps} style={{ padding: 0 }}>
              {options.children}
            </List>
          </Paper>
        )}
        onSuggestionSelected={this.onSuggestionSelected}
      />
    )
  }
}
