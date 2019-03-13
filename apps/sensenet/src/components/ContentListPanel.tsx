import TableCell from '@material-ui/core/TableCell'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React, { useContext, useState } from 'react'
import { CurrentAncestorsContext } from '../context/CurrentAncestors'
import { CurrentChildrenContext } from '../context/CurrentChildren'
import { CurrentContentContext } from '../context/CurrentContent'
import { RepositoryContext } from '../context/RepositoryContext'
import { ContentBreadcrumbs } from './ContentBreadcrumbs'
import { DropFileArea } from './DropFileArea'
import { Icon } from './Icon'
import { SelectionControl } from './SelectionControl'

export const CollectionComponent: React.StatelessComponent<{
  enableBreadcrumbs?: boolean
  parentId: number
  onParentChange: (newParent: GenericContent) => void
  onTabRequest: () => void
  onActivateItem: (item: GenericContent) => void
  style?: React.CSSProperties
  containerRef?: (r: HTMLDivElement | null) => void
  fields: Array<keyof GenericContent>
  requestReload?: () => void
}> = props => {
  const parent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext)
  const ancestors = useContext(CurrentAncestorsContext)

  const [activeContent, setActiveContent] = useState<GenericContent>(children[0])
  const [selected, setSelected] = useState<GenericContent[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const repo = useContext(RepositoryContext)

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
      props.onParentChange(item)
    } else {
      props.onActivateItem(item)
    }
  }

  return (
    <div style={{ ...props.style }}>
      {props.enableBreadcrumbs ? <ContentBreadcrumbs onItemClick={i => props.onParentChange(i.content)} /> : null}
      <DropFileArea parent={parent} style={{ height: '100%', overflow: 'auto' }}>
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
                setActiveContent(
                  activeContent && children[Math.max(0, children.findIndex(c => c.Id === activeContent.Id) - 1)],
                )
                break
              case 'ArrowDown':
                setActiveContent(
                  activeContent &&
                    children[Math.min(children.findIndex(c => c.Id === activeContent.Id) + 1, children.length - 1)],
                )
                break
              case ' ': {
                ev.preventDefault()
                activeContent && selected.findIndex(s => s.Id === activeContent.Id) !== -1
                  ? setSelected([...selected.filter(s => s.Id !== activeContent.Id)])
                  : activeContent && setSelected([...selected, activeContent])
                break
              }
              case 'Insert': {
                activeContent && selected.findIndex(s => s.Id === activeContent.Id) !== -1
                  ? setSelected([...selected.filter(s => s.Id !== activeContent.Id)])
                  : activeContent && setSelected([...selected, activeContent])
                activeContent &&
                  setActiveContent(
                    children[Math.min(children.findIndex(c => c.Id === activeContent.Id) + 1, children.length)],
                  )
                break
              }
              case '*': {
                if (selected.length === children.length) {
                  setSelected([])
                } else {
                  setSelected(children)
                }
                break
              }
              case 'Enter': {
                activeContent && handleActivateItem(activeContent)
                break
              }
              case 'Backspace': {
                ancestors.length && props.onParentChange(ancestors[ancestors.length - 1])
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
                  setSelected(selected.filter(s => s.Id !== content.Id))
                } else {
                  setSelected([...selected, content])
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
                setSelected(newSelection)
              } else if (!selected.length || (selected.length === 1 && selected[0].Id !== content.Id)) {
                setSelected([content])
              }
            }}
            onItemDoubleClick={(_ev, item) => handleActivateItem(item)}
            getSelectionControl={(isSelected, content) => <SelectionControl {...{ isSelected, content }} />}
            fieldComponent={fieldOptions => {
              switch (fieldOptions.field) {
                case 'DisplayName':
                  return (
                    <TableCell padding={'none'}>
                      {fieldOptions.content.DisplayName || fieldOptions.content.Name}
                    </TableCell>
                  )
                case 'CreatedBy':
                  return fieldOptions.content.CreatedBy ? (
                    <TableCell padding={'none'}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {' '}
                        <Icon item={fieldOptions.content.CreatedBy as GenericContent} />
                        <div style={{ marginLeft: '1em' }}>
                          {(fieldOptions.content.CreatedBy as GenericContent).DisplayName ||
                            (fieldOptions.content.CreatedBy as GenericContent).Name}
                        </div>
                      </div>
                    </TableCell>
                  ) : null
              }
              return null
            }}
            fieldsToDisplay={props.fields}
            selected={selected}
            onRequestSelectionChange={setSelected}
            icons={{}}
          />
        </div>
      </DropFileArea>
    </div>
  )
}
