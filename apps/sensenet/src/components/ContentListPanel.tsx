import TableCell from '@material-ui/core/TableCell'
import { Repository } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React, { useContext, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { ContentContextProvider } from '../services/ContentContextProvider'
import { rootStateType } from '../store'
import { createCollectionState } from '../store/CollectionState'
import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs'
import { Icon } from './Icon'
import { InjectorContext } from './InjectorContext'
import { SelectionControl } from './SelectionControl'

export const createCommandListPanel = (collectionState: ReturnType<typeof createCollectionState>) => {
  const mapStateToProps = (state: rootStateType) => ({
    collection: collectionState.collectionOptions.getSelfState(state),
  })

  const mapDispatchToProps = {
    loadParent: collectionState.loadParent,
    select: collectionState.select,
    setActiveContent: collectionState.setActive,
  }

  const CollectionComponent: React.StatelessComponent<
    {
      parentId: number
      onParentChange: (newParent: GenericContent) => void
      onTabRequest: () => void
      onActivateItem: (item: GenericContent) => void
      style?: React.CSSProperties
      containerRef?: (r: HTMLDivElement | null) => void
    } & ReturnType<typeof mapStateToProps> &
      typeof mapDispatchToProps
  > = props => {
    const { ancestors, children, parent, activeContent, selected } = props.collection
    const { setActiveContent, select, loadParent } = props
    const injector = useContext(InjectorContext)
    const [isFocused, setIsFocused] = useState(false)
    const repo = injector.GetInstance(Repository)

    useEffect(() => {
      loadParent(props.parentId)
    }, [props.parentId])

    let searchString = ''
    const runSearch = debounce(() => {
      const child = children.find(
        c =>
          c.Name.toLocaleLowerCase().indexOf(searchString) === 0 ||
          (c.DisplayName && c.DisplayName.toLocaleLowerCase().indexOf(searchString)) === 0,
      )
      child && setActiveContent(child)
      searchString = ''
    }, 500)

    const handleActivateItem = (item: GenericContent) => {
      if (item.IsFolder) {
        props.loadParent(item.Id)
        props.onParentChange(item)
      } else {
        props.onActivateItem(item)
      }
    }

    return (
      <div style={{ ...props.style }}>
        {parent ? (
          <Breadcrumbs
            content={ancestors.map(
              content =>
                ({
                  displayName: content.DisplayName || content.Name,
                  title: content.Path,
                  url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(content),
                  content,
                } as BreadcrumbItem),
            )}
            currentContent={{
              displayName: parent.DisplayName || parent.Name,
              title: parent.Path,
              url: injector.GetInstance(ContentContextProvider).getPrimaryActionUrl(parent),
              content: parent,
            }}
            onItemClick={(_ev, item) => {
              handleActivateItem(item.content)
            }}
          />
        ) : null}
        <div
          style={{
            ...(isFocused ? {} : { opacity: 0.8 }),
            height: 'calc(100% - 36px)',
            overflow: 'auto',
            userSelect: 'none',
            outline: 'none',
          }}
          tabIndex={0}
          onFocus={() => {
            setIsFocused(true)
          }}
          onBlur={() => setIsFocused(false)}
          ref={props.containerRef}
          onKeyDown={ev => {
            if (!activeContent) {
              setActiveContent(children[0])
            }
            switch (ev.key) {
              case 'Home':
                setActiveContent(children[0])
                break
              case 'End':
                setActiveContent(children[children.length - 1])
                break
              case 'ArrowUp':
                setActiveContent(children[Math.max(0, children.findIndex(c => c.Id === activeContent.Id) - 1)])
                break
              case 'ArrowDown':
                setActiveContent(
                  children[Math.min(children.findIndex(c => c.Id === activeContent.Id) + 1, children.length - 1)],
                )
                break
              case ' ': {
                ev.preventDefault()
                selected.findIndex(s => s.Id === activeContent.Id) !== -1
                  ? select([...selected.filter(s => s.Id !== activeContent.Id)])
                  : select([...selected, activeContent])
                break
              }
              case 'Insert': {
                selected.findIndex(s => s.Id === activeContent.Id) !== -1
                  ? select([...selected.filter(s => s.Id !== activeContent.Id)])
                  : select([...selected, activeContent])
                setActiveContent(
                  children[Math.min(children.findIndex(c => c.Id === activeContent.Id) + 1, children.length)],
                )
                break
              }
              case '*': {
                if (selected.length === children.length) {
                  select([])
                } else {
                  select(children)
                }
                break
              }
              case 'Enter': {
                handleActivateItem(activeContent)
                break
              }
              case 'Backspace': {
                ancestors.length && loadParent(ancestors[ancestors.length - 1].Id)
                break
              }
              case 'Tab':
                ev.preventDefault()
                props.onTabRequest()
                break
              default:
                if (ev.key.length === 1) {
                  searchString = searchString + ev.key
                  runSearch()
                }
            }
          }}>
          <ContentList<GenericContent>
            items={children}
            schema={repo.schemas.getSchema(GenericContent)}
            onRequestActiveItemChange={setActiveContent}
            active={activeContent}
            onItemClick={(ev, content) => {
              if (ev.ctrlKey) {
                if (selected.find(s => s.Id === content.Id)) {
                  select(selected.filter(s => s.Id !== content.Id))
                } else {
                  select([...selected, content])
                }
              } else if (ev.shiftKey) {
                const activeIndex = (activeContent && children.findIndex(s => s.Id === activeContent.Id)) || 0
                const clickedIndex = children.findIndex(s => s.Id === content.Id)
                const newSelection = Array.from(
                  new Set([
                    ...selected,
                    ...[...children].slice(
                      Math.min(activeIndex, clickedIndex),
                      Math.max(activeIndex, clickedIndex) + 1,
                    ),
                  ]),
                )
                select(newSelection)
              } else if (!selected.length || (selected.length === 1 && selected[0].Id !== content.Id)) {
                select([content])
              }
            }}
            onItemDoubleClick={(_ev, item) => handleActivateItem(item)}
            getSelectionControl={(isSelected, content) => <SelectionControl {...{ isSelected, content }} />}
            fieldComponent={options => {
              switch (options.field) {
                case 'DisplayName':
                  return <TableCell padding={'none'}>{options.content.DisplayName || options.content.Name}</TableCell>
                case 'CreatedBy':
                  return options.content.CreatedBy ? (
                    <TableCell padding={'none'}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {' '}
                        <Icon item={options.content.CreatedBy as GenericContent} />
                        <div style={{ marginLeft: '1em' }}>
                          {(options.content.CreatedBy as GenericContent).DisplayName ||
                            (options.content.CreatedBy as GenericContent).Name}
                        </div>
                      </div>
                    </TableCell>
                  ) : null
              }
              return null
            }}
            fieldsToDisplay={['DisplayName', 'CreatedBy', 'Type']}
            selected={selected}
            onRequestSelectionChange={select}
            icons={{}}
          />
        </div>
      </div>
    )
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CollectionComponent)
}
