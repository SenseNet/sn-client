import { MuiThemeProvider } from '@material-ui/core/styles'
import { ConstantContent, Content } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { ActionModel, GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import { compile } from 'path-to-regexp'
import React, { Component, MouseEvent } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as DMSActions from '../Actions'
import { contentListTheme } from '../assets/contentlist'
import { icons } from '../assets/icons'
import { customSchema } from '../assets/schema'
import { ListToolbar } from '../components/ListToolbar'
import {
  loadMore,
  loadParent,
  resetSearchValues,
  select,
  setActive,
  updateChildrenOptions,
  updateSearchValues,
} from '../store/documentlibrary/actions'
import { rootStateType } from '../store/rootReducer'
import ActionMenu from './ActionMenu/ActionMenu'
import ActionsCell from './ContentList/CellTemplates/ActionsCell'
import { DateCell } from './ContentList/CellTemplates/DateCell'
import { DefaultCell } from './ContentList/CellTemplates/DefaultCell'
import { DisplayNameCell } from './ContentList/CellTemplates/DisplayNameCell'
import LockedCell from './ContentList/CellTemplates/LockedCell'
import { ReferencedUserCell } from './ContentList/CellTemplates/ReferencedUserCell'
import { FetchError } from './FetchError'
import { GridPlaceholder } from './Loaders/GridPlaceholder'
import { SearchResultsHeader } from './SearchResultsHeader'
import { UploadBar } from './Upload/UploadBar'

const ConnectedUploadBar = connect(
  (state: rootStateType) => ({
    items: state.dms.uploads.uploads,
    isOpened: state.dms.uploads.showProgress,
  }),
  {
    close: DMSActions.hideUploadProgress,
    removeItem: DMSActions.hideUploadItem,
  },
)(UploadBar)

const mapStateToProps = (state: rootStateType) => {
  return {
    loggedinUser: state.sensenet.session.user,
    items: state.dms.documentLibrary.items,
    errorMessage: state.dms.documentLibrary.error,
    isLoading: state.dms.documentLibrary.isLoadingParent,
    parent: state.dms.documentLibrary.parent,
    parentIdOrPath: state.dms.documentLibrary.parentIdOrPath,
    editedItemId: state.dms.editedItemId,
    currentUser: state.sensenet.session.user,
    selected: state.dms.documentLibrary.selected,
    active: state.dms.documentLibrary.active,
    ancestors: state.dms.documentLibrary.ancestors,
    childrenOptions: state.dms.documentLibrary.childrenOptions,
    hostName: state.sensenet.session.repository ? state.sensenet.session.repository.repositoryUrl : '',
  }
}

const mapDispatchToProps = {
  loadParent,
  loadMore,
  openActionMenu: DMSActions.openActionMenu,
  closeActionMenu: DMSActions.closeActionMenu,
  select,
  setActive,
  updateChildrenOptions,
  updateSearchValues,
  resetSearchValues,
}

interface TrashProps extends RouteComponentProps<any> {
  matchesDesktop: boolean
}

interface TrashState {
  showLoader: boolean
}

class Trash extends Component<TrashProps & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps, TrashState> {
  constructor(props: Trash['props']) {
    super(props)
    this.state = {
      showLoader: this.props.isLoading,
    }

    this.handleRowDoubleClick = this.handleRowDoubleClick.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleClearSearchResults = this.handleClearSearchResults.bind(this)
  }

  private handleClearSearchResults() {
    this.props.updateChildrenOptions({
      query: undefined,
    })
    this.props.updateSearchValues({
      contains: undefined,
      dateModified: undefined,
      itemName: undefined,
      owner: undefined,
      rootPath: undefined,
      searchString: undefined,
      sharedWith: undefined,
      type: undefined,
    })
  }

  private handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      this.props.loadMore()
    }
  }

  private static updateStoreFromPath(newProps: Trash['props']) {
    try {
      const trashPath = `/Root/Trash`
      newProps.loadParent(trashPath)

      const queryObject = newProps.location.search
        .substring(1)
        .split('&')
        .map((segment) => segment.split('='))
        .reduce((acc, val) => {
          acc[val[0]] = decodeURIComponent(val[1])
          return acc
        }, {} as any)

      if (queryObject.query && queryObject.query !== newProps.childrenOptions.query) {
        newProps.updateChildrenOptions({
          query: queryObject.query,
        })
        if (queryObject.queryName) {
          newProps.updateSearchValues({
            contains: queryObject.queryName,
          })
        }
      }
    } catch (error) {
      /** Cannot parse current folder from URL */
      return compile(newProps.match.path)({ folderPath: '' })
    }
  }

  public static getDerivedStateFromProps(newProps: Trash['props'], lastState: Trash['state']) {
    if (newProps.loggedinUser.userName !== 'Visitor') {
      const newPath = Trash.updateStoreFromPath(newProps)
      if (newPath && newPath !== newProps.match.url) {
        newProps.history.push(newPath)
      }
    }
    return {
      ...lastState,
    }
  }

  public handleRowDoubleClick(_e: MouseEvent, content: GenericContent) {
    this.props.resetSearchValues()
    this.props.updateChildrenOptions({ query: '' })
    if (content.IsFolder) {
      const newPath = compile(this.props.match.path)({ folderPath: btoa(content.Path) })
      this.props.history.push(newPath)
    } else {
      const newPath = compile(this.props.match.path)({
        folderPath: this.props.match.params.folderPath || btoa(this.props.parentIdOrPath as any),
        otherActions: ['preview', btoa(content.Id as any)],
      })
      this.props.history.push(newPath)
    }
  }

  public componentDidUpdate() {
    // this.handleScroll()
  }

  public componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  private updateLoading = debounce((value: boolean) => {
    this.setState({
      showLoader: value && !this.props.childrenOptions.skip,
    })
  }, 300)

  public render() {
    this.updateLoading(this.props.isLoading)
    if (this.props.errorMessage && this.props.errorMessage.length > 0) {
      return (
        <FetchError
          message={this.props.errorMessage}
          onRetry={() => {
            // this.fetchData()
          }}
        />
      )
    }
    const { matchesDesktop } = this.props
    return this.props.currentUser.content.Id !== ConstantContent.VISITOR_USER.Id ? (
      <div>
        {this.props.childrenOptions.query ? (
          <SearchResultsHeader query={this.props.childrenOptions.query} clearResults={this.handleClearSearchResults} />
        ) : (
          <ListToolbar
            currentContent={this.props.parent}
            selected={this.props.selected}
            ancestors={this.props.ancestors}
          />
        )}
        <ConnectedUploadBar />
        <GridPlaceholder
          columns={5}
          rows={3}
          style={{
            position: 'sticky',
            zIndex: this.state.showLoader ? 1 : -1,
            height: 0,
            opacity: this.state.showLoader ? 1 : 0,
            transition: 'opacity 500ms cubic-bezier(0.230, 1.000, 0.320, 1.000)',
          }}
          columnStyle={{ backgroundColor: 'white' }}
        />
        <div
          style={{
            opacity: !this.state.showLoader ? 1 : 0,
            transition: 'opacity 500ms cubic-bezier(0.230, 1.000, 0.320, 1.000)',
          }}>
          <MuiThemeProvider theme={contentListTheme}>
            <ContentList
              displayRowCheckbox={matchesDesktop && !this.props.childrenOptions.query ? true : false}
              schema={customSchema.find((s) => s.ContentTypeName === 'GenericContent') as any}
              selected={this.props.selected}
              active={this.props.active}
              items={this.props.items.d.results}
              fieldsToDisplay={
                matchesDesktop
                  ? this.props.childrenOptions.query
                    ? ['DisplayName']
                    : ['DisplayName', 'Locked', 'ModificationDate', 'Owner', 'Actions']
                  : ['DisplayName', 'Actions']
              }
              orderBy={this.props.childrenOptions.orderby && (this.props.childrenOptions.orderby[0][0] as any)}
              orderDirection={this.props.childrenOptions.orderby && (this.props.childrenOptions.orderby[0][1] as any)}
              onRequestSelectionChange={(newSelection) => this.props.select(newSelection)}
              onRequestActiveItemChange={(active) => this.props.setActive(active)}
              onRequestActionsMenu={(ev, content) => {
                ev.preventDefault()
                this.props.closeActionMenu()
                this.props.openActionMenu(
                  content.Actions as ActionModel[],
                  content,
                  '',
                  ev.currentTarget.parentElement,
                  { top: ev.clientY, left: ev.clientX },
                )
              }}
              onItemContextMenu={(ev, content) => {
                ev.preventDefault()
                this.props.closeActionMenu()
                this.props.openActionMenu(
                  content.Actions as ActionModel[],
                  content,
                  '',
                  ev.currentTarget.parentElement,
                  { top: ev.clientY, left: ev.clientX },
                )
              }}
              onRequestOrderChange={(field, direction) => {
                if (field !== 'Workspace' && field !== 'Owner' && field !== 'Actions') {
                  this.props.updateChildrenOptions({
                    ...this.props.childrenOptions,
                    orderby: [[field, direction]],
                  })
                }
              }}
              onItemClick={(ev, content) => {
                if (ev.ctrlKey) {
                  if (this.props.selected.find((s) => s.Id === content.Id)) {
                    this.props.select(this.props.selected.filter((s) => s.Id !== content.Id))
                  } else {
                    this.props.select([...this.props.selected, content])
                  }
                } else if (ev.shiftKey) {
                  const activeIndex =
                    (this.props.active &&
                      this.props.items.d.results.findIndex((s) => s.Id === (this.props.active as Content).Id)) ||
                    0
                  const clickedIndex = this.props.items.d.results.findIndex((s) => s.Id === content.Id)
                  const newSelection = Array.from(
                    new Set([
                      ...this.props.selected,
                      ...[...this.props.items.d.results].slice(
                        Math.min(activeIndex, clickedIndex),
                        Math.max(activeIndex, clickedIndex) + 1,
                      ),
                    ]),
                  )
                  this.props.select(newSelection)
                } else if (
                  !this.props.selected.length ||
                  (this.props.selected.length === 1 && this.props.selected[0].Id !== content.Id)
                ) {
                  this.props.select([content])
                }
              }}
              onItemDoubleClick={this.handleRowDoubleClick}
              checkboxProps={{ color: 'primary' }}
              fieldComponent={(props) => {
                switch (props.field) {
                  case 'Locked':
                    return <LockedCell content={props.content} fieldName={props.field} />
                  case 'DisplayName':
                    return (
                      <DisplayNameCell
                        content={props.content}
                        isSelected={props.isSelected}
                        icons={icons}
                        hostName={this.props.hostName}
                      />
                    )
                  case 'Owner':
                    return <ReferencedUserCell content={props.content} fieldName={props.field} />
                  case 'Actions':
                    return <ActionsCell content={props.content} fieldName={props.field} />
                  case 'ModificationDate':
                  case 'CreationDate':
                    return <DateCell content={props.content} fieldName={props.field} />
                  default:
                    return <DefaultCell content={props.content} fieldName={props.field} />
                }
              }}
              icons={icons}
            />
            <ActionMenu id={0} />
          </MuiThemeProvider>
        </div>
      </div>
    ) : null
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Trash))
