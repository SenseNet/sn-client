import { Folder, GenericContent, File as SnFile } from '@sensenet/default-content-types'
import { Icon, iconType } from '@sensenet/icons-react'
import { Query } from '@sensenet/query'
import { AdvancedSearch, AdvancedSearchOptions, NestedTextField, PresetField, TextField } from '@sensenet/search-react'
import { RepositoryContext } from '@sensenet/hooks-react'
import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Popover from '@material-ui/core/Popover'
import Typography from '@material-ui/core/Typography'
import { resources } from '../../assets/resources'
import { loadParent, setChildrenOptions, updateSearchValues } from '../../store/documentlibrary/actions'
import { DocumentLibraryState } from '../../store/documentlibrary/reducers'
import { closePicker, openPicker, setPickerParent } from '../../store/picker/actions'
import { rootStateType } from '../../store/rootReducer'
import PathPickerDialog from '../Pickers/PathPickerDialog'
import QuickSearchBox from './SearchInput'

const styles = {
  searchContainerMobile: {
    flex: 5,
  },
  searchButton: {
    color: '#fff',
    marginRight: -10,
    height: 36,
  },
}

const mapStateToProps = (state: rootStateType) => ({
  ancestors: state.dms.documentLibrary.ancestors,
  query: state.dms.documentLibrary.childrenOptions.query,
  parent: state.dms.documentLibrary.parent,
  searchState: state.dms.documentLibrary.searchState,
  selectedTypeRoot: state.dms.picker.selected,
  isLoadingParent: state.dms.documentLibrary.isLoadingParent,
  isLoadingChildren: state.dms.documentLibrary.isLoadingChildren,
})

const mapDispatchToProps = {
  setChildrenOptions,
  loadParent,
  updateSearchValues,
  setPickerParent,
  openPicker,
  closePicker,
}

interface SearchDocumentsState {
  parent?: GenericContent
  isOpen: boolean
  query?: string
}

const titleWidth = 2
const contentWidth = 7
const containerStyles: React.CSSProperties = {
  padding: '1em',
  display: 'flex',
  flexDirection: 'column',
  marginRight: '4em',
}

const rowStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
}

const titleColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '1em 0',
  flexGrow: titleWidth,
  width: 200,
}

const contentColumnStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flexGrow: contentWidth,
}

const SearchRow: React.StatelessComponent<{ title: string }> = (props) => (
  <div style={rowStyles}>
    <Typography style={titleColumnStyles} variant="body1">
      {props.title}
    </Typography>
    <div style={contentColumnStyles}>{props.children}</div>
  </div>
)

class SearchDocuments extends React.Component<
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { style?: React.CSSProperties } & React.Props<any>,
  SearchDocumentsState
> {
  constructor(props: SearchDocuments['props']) {
    super(props)
    this.state = {
      parent: this.props.parent,
      isOpen: false,
      query: this.props.query,
    }
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
    this.handleQueryChanged = this.handleQueryChanged.bind(this)
    this.handleFieldQueryChanged = this.handleFieldQueryChanged.bind(this)
    this.handlePickLocation = this.handlePickLocation.bind(this)
    this.handleSelectTypeRoot = this.handleSelectTypeRoot.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  public onClick = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  private handleQueryChanged(innerQuery: Query<any>) {
    if (innerQuery.toString()) {
      this.setState({
        query: new Query((q) =>
          q.query((typeQuery) => typeQuery.typeIs(SnFile).or.typeIs(Folder)).and.query(innerQuery),
        ).toString(),
      })
    } else {
      this.setState({ query: '' })
    }
  }

  private handleFieldQueryChanged(
    key: keyof DocumentLibraryState['searchState'],
    value: Query<any>,
    plainValue: string,
    callback: (key: string, value: Query<any>) => void,
  ) {
    const update: any = {}
    update[key] = plainValue
    this.props.updateSearchValues(update)
    callback(key, value)
  }

  private handleOnSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    /** */
    if (this.state.query !== this.props.query) {
      this.props.setChildrenOptions({
        // path: this.props.searchState.rootPath,
        query: this.state.query && this.state.query.toString(),
      })
      this.props.parent && this.props.loadParent(this.state.parent ? this.state.parent.Id : this.props.parent.Id)
      this.handleClose()
    }
  }

  private handlePickLocation(_ev: React.MouseEvent, options: AdvancedSearchOptions<any>) {
    this.props.openPicker(
      <PathPickerDialog
        showAddFolder={false}
        mode="SearchRoot"
        dialogTitle={resources.SEARCH_LOCATION_TITLE}
        dialogCallback={(selectedItems) => this.handleSelectTypeRoot(selectedItems[0], options)}
        currentPath={this.props.parent ? this.props.parent.Path : ''}
      />,
      'selectSearchRoot',
      this.props.closePicker,
    )
  }

  private handleSelectTypeRoot(content: GenericContent, options: AdvancedSearchOptions<any>) {
    this.props.updateSearchValues({
      rootPath: content.Path,
    })
    this.setState({
      parent: content,
    })
    options.updateQuery('InTree', new Query((q) => q.inTree(content.Path)))
    this.props.closePicker()
  }

  private handleClose() {
    this.setState({
      isOpen: false,
    })
  }

  private elementRef: HTMLElement | null = null
  private searchBoxContainerRef: HTMLElement | null = null

  public render() {
    return (
      <RepositoryContext.Consumer>
        {(repository) => (
          <AdvancedSearch
            schema={repository.schemas.getSchemaByName('GenericContent')}
            onQueryChanged={this.handleQueryChanged}
            style={{ width: '100%' }}
            fields={(options) => (
              <MediaQuery minDeviceWidth={700}>
                {(matches) => {
                  if (matches) {
                    return (
                      <form
                        style={{ ...(matches ? null : styles.searchContainerMobile), ...this.props.style }}
                        onSubmit={this.handleOnSubmit}>
                        <QuickSearchBox
                          {...this.props}
                          isLoading={
                            (this.state.query && this.props.isLoadingParent) || this.props.isLoadingChildren
                              ? true
                              : false
                          }
                          isOpen={matches ? this.state.isOpen : true}
                          onClick={this.onClick}
                          startAdornmentRef={(r) => {
                            this.elementRef = r
                          }}
                          containerRef={(r) => (this.searchBoxContainerRef = r)}
                          inputProps={{
                            style: {
                              width: '100%',
                            },
                            value: this.props.searchState.contains,
                            placeholder: resources.SEARCH_DOCUMENTS_PLACEHOLDER,
                            onChange: (ev) => {
                              const term = ev.currentTarget.value
                              this.props.updateSearchValues({ contains: term })
                              this.handleFieldQueryChanged(
                                'contains',
                                new Query((q) => (term ? q.equals('_Text', `*${term}*`) : q)),
                                term,
                                options.updateQuery,
                              )
                            },
                          }}
                          containerProps={{
                            style: {
                              width: '60%',
                              minWidth: '450px',
                            },
                          }}
                        />
                        <Popover
                          BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,.1)' } }}
                          disablePortal={true}
                          onBackdropClick={this.handleClose}
                          open={this.state.isOpen}
                          anchorEl={this.elementRef}
                          anchorOrigin={{
                            horizontal: 'left',
                            vertical: 'bottom',
                          }}
                          PaperProps={{
                            style: {
                              width: (this.searchBoxContainerRef && this.searchBoxContainerRef.offsetWidth) || 0,
                              overflow: 'hidden',
                            },
                          }}>
                          <div style={containerStyles}>
                            <SearchRow title="Type">
                              <PresetField
                                fullWidth={true}
                                fieldName="Type"
                                value={this.props.searchState.type || 'Any'}
                                presets={[
                                  { text: 'Any', value: new Query((q) => q) },
                                  {
                                    text: 'Document',
                                    value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'word')),
                                  },
                                  {
                                    text: 'Sheet',
                                    value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'excel')),
                                  },
                                  {
                                    text: 'Text',
                                    value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'document')),
                                  },
                                  {
                                    text: 'Slide',
                                    value: new Query((q) => q.typeIs(File).and.equals('Icon' as any, 'powerpoint')),
                                  },
                                  { text: 'Folder', value: new Query((q) => q.typeIs(Folder)) },
                                ]}
                                onQueryChange={(_key, query, name) =>
                                  this.handleFieldQueryChanged('type', query, name, options.updateQuery)
                                }
                              />
                            </SearchRow>
                            <SearchRow title="Owner">
                              <NestedTextField
                                fullWidth={true}
                                placeholder={resources.SEARCH_OWNER_PLACEHOLDER}
                                fieldName={'Owner'}
                                onQueryChange={(_key, query, plainValue) =>
                                  this.handleFieldQueryChanged('owner', query, plainValue, options.updateQuery)
                                }
                                value={this.props.searchState.owner}
                                nestedFieldName={
                                  this.props.searchState.owner && this.props.searchState.owner.indexOf('@') > -1
                                    ? 'LoginName'
                                    : 'Name'
                                }
                              />
                            </SearchRow>
                            <SearchRow title="Shared with">
                              <TextField
                                fullWidth={true}
                                placeholder={resources.SEARCH_SHAREDWITH_PLACEHOLDER}
                                fieldName={'SharedWith'}
                                onQueryChange={(_key, query, plainValue) =>
                                  this.handleFieldQueryChanged('sharedWith', query, plainValue, options.updateQuery)
                                }
                                value={this.props.searchState.sharedWith}
                              />
                            </SearchRow>
                          </div>
                          <Divider />
                          <div style={containerStyles}>
                            <SearchRow title="Item name">
                              <TextField
                                fullWidth={true}
                                placeholder={resources.SEARCH_ITEMNAME_PLACEHOLDER}
                                fieldName={'DisplayName'}
                                onQueryChange={(_key, query, plainValue) =>
                                  this.handleFieldQueryChanged('itemName', query, plainValue, options.updateQuery)
                                }
                                value={this.props.searchState.itemName}
                              />
                            </SearchRow>
                            <SearchRow title="Date modified">
                              <PresetField
                                fullWidth={true}
                                fieldName="ModificationDate"
                                presets={[
                                  { text: '-', value: new Query((a) => a) },
                                  { text: 'Today', value: new Query((a) => a.term('ModificationDate:>@@Today@@')) },
                                  {
                                    text: 'Yesterday',
                                    value: new Query((a) =>
                                      a.term('ModificationDate:>@@Yesterday@@').and.term('ModificationDate:<@@Today@@'),
                                    ),
                                  },
                                  {
                                    text: 'Last 7 days',
                                    value: new Query((a) =>
                                      a.term('ModificationDate:>@@Today-7days@@').and.term('CreationDate:<@@Today@@'),
                                    ),
                                  },
                                  {
                                    text: 'Last 30 days',
                                    value: new Query((a) =>
                                      a
                                        .term('ModificationDate:>@@Today-30days@@')
                                        .and.term('ModificationDate:<@@Today@@'),
                                    ),
                                  },
                                  {
                                    text: 'Last 90 days',
                                    value: new Query((a) =>
                                      a
                                        .term('ModificationDate:>@@Today-90days@@')
                                        .and.term('ModificationDate:<@@Today@@'),
                                    ),
                                  },
                                  {
                                    text: 'Last 365 days',
                                    value: new Query((a) =>
                                      a
                                        .term('ModificationDate:>@@Today-365days@@')
                                        .and.term('ModificationDate:<@@Today@@'),
                                    ),
                                  },
                                ]}
                                onQueryChange={(_key, query, name) =>
                                  this.handleFieldQueryChanged('dateModified', query, name, options.updateQuery)
                                }
                                value={this.props.searchState.dateModified}
                              />
                            </SearchRow>
                            <SearchRow title={resources.SEARCH_CONTAINS_TITLE}>
                              <TextField
                                fullWidth={true}
                                value={this.props.searchState.contains}
                                placeholder={resources.SEARCH_CONTAINS_PLACEHOLDER}
                                fieldName={'_Text'}
                                onQueryChange={(_key, query, plainValue) =>
                                  this.handleFieldQueryChanged('contains', query, plainValue, options.updateQuery)
                                }
                              />
                            </SearchRow>
                            <SearchRow title={resources.SEARCH_LOCATION_BUTTON_TITLE}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                  style={{ boxShadow: 'none' }}
                                  variant="contained"
                                  onClick={(ev) => this.handlePickLocation(ev, options)}>
                                  {this.props.selectedTypeRoot[0]
                                    ? this.props.selectedTypeRoot[0].DisplayName
                                    : resources.SEARCH_LOCATION_ANYWHERE}
                                </Button>
                                <Button
                                  style={{ boxShadow: 'none' }}
                                  type="submit"
                                  variant="contained"
                                  color="secondary">
                                  Search
                                </Button>
                              </div>
                            </SearchRow>
                          </div>
                        </Popover>
                      </form>
                    )
                  } else {
                    return (
                      <IconButton style={styles.searchButton}>
                        <Icon type={iconType.materialui} iconName="search" style={{ color: '#fff' }} />
                      </IconButton>
                    )
                  }
                }}
              </MediaQuery>
            )}
          />
        )}
      </RepositoryContext.Consumer>
    )
  }
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(SearchDocuments)

export { connectedComponent as SearchDocuments }
