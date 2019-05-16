import TableCell from '@material-ui/core/TableCell'
import Check from '@material-ui/icons/Check'
import Close from '@material-ui/icons/Close'
import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList } from '@sensenet/list-controls-react'
import React, { useContext, useEffect, useState } from 'react'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  RepositoryContext,
  ResponsiveContext,
  ResponsivePersonalSetttings,
  ResponsivePlatforms,
} from '../context'
import { ContentBreadcrumbs } from './ContentBreadcrumbs'
import { ContentContextMenu } from './ContentContextMenu'
import { DeleteContentDialog } from './DeleteContentDialog'
import { DropFileArea } from './DropFileArea'
import { Icon } from './Icon'
import { SecondaryActionsMenu } from './SecondaryActionsMenu'
import { SelectionControl } from './SelectionControl'

export interface CollectionComponentProps {
  enableBreadcrumbs?: boolean
  parentId: number
  onParentChange: (newParent: GenericContent) => void
  onTabRequest: () => void
  onActiveItemChange?: (item: GenericContent) => void
  onActivateItem: (item: GenericContent) => void
  style?: React.CSSProperties
  containerRef?: (r: HTMLDivElement | null) => void
  requestReload?: () => void
  fieldsToDisplay?: Array<keyof GenericContent>
  onSelectionChange?: (sel: GenericContent[]) => void
  onFocus?: () => void
  containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

export const DisplayNameComponent: React.FunctionComponent<{
  content: GenericContent
  device: ResponsivePlatforms
  isActive: boolean
}> = ({ content, device, isActive }) => {
  return (
    <TableCell padding={'none'}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {content.DisplayName || content.Name}
        {device === 'mobile' && isActive ? (
          <CurrentContentContext.Provider value={content}>
            <SecondaryActionsMenu style={{ float: 'right' }} />
          </CurrentContentContext.Provider>
        ) : null}
      </div>
    </TableCell>
  )
}

export const CollectionComponent: React.FunctionComponent<CollectionComponentProps> = props => {
  const parent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext)
  const ancestors = useContext(CurrentAncestorsContext)
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const [activeContent, setActiveContent] = useState<GenericContent>(children[0])
  const [selected, setSelected] = useState<GenericContent[]>([])
  const [isFocused, setIsFocused] = useState(true)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<HTMLElement | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const repo = useContext(RepositoryContext)
  const loadSettings = useContext(LoadSettingsContext)

  const [currentOrder, setCurrentOrder] = useState<keyof GenericContent>('DisplayName')
  const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    props.onActiveItemChange && props.onActiveItemChange(activeContent)
  }, [activeContent])

  useEffect(() => {
    isFocused && props.onFocus && props.onFocus()
  }, [isFocused])

  useEffect(() => {
    props.onSelectionChange && props.onSelectionChange(selected)
  }, [selected])

  useEffect(() => {
    const currentField =
      (loadSettings.loadChildrenSettings.orderby && loadSettings.loadChildrenSettings.orderby[0][0]) || 'DisplayName'
    let order: 'asc' | 'desc' =
      (loadSettings.loadChildrenSettings.orderby && (loadSettings.loadChildrenSettings.orderby[0][1] as any)) || 'asc'

    if (currentOrder === currentField) {
      order = order === 'asc' ? 'desc' : 'asc'
    }
    loadSettings.setLoadChildrenSettings({
      orderby:
        loadSettings.loadChildrenSettings.orderby && loadSettings.loadChildrenSettings.orderby.length === 1
          ? [[currentOrder as any, order as any]]
          : [['DisplayName', 'asc']],
      select: personalSettings.content.fields,
      expand: personalSettings.content.fields.filter(f => isReferenceField(f)),
    })
    setCurrentOrder(currentOrder)
    setCurrentDirection(currentDirection)
  }, [currentOrder, currentDirection])

  useEffect(() => {
    setSelected([])
  }, [parent])

  useEffect(() => {
    setIsContextMenuOpened(false)
  }, [children, activeContent, selected])

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

  const isReferenceField = (fieldName: string) => {
    const refWhiteList = ['AllowedChildTypes']
    const setting = repo.schemas.getSchemaByName('GenericContent').FieldSettings.find(f => f.Name === fieldName)
    return refWhiteList.indexOf(fieldName) !== -1 || (setting && setting.Type === 'ReferenceFieldSetting') || false
  }

  return (
    <div style={{ ...props.style }} {...props.containerProps}>
      {props.enableBreadcrumbs ? <ContentBreadcrumbs onItemClick={i => props.onParentChange(i.content)} /> : null}
      <DropFileArea parent={parent} style={{ height: '100%', overflow: 'hidden' }}>
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
          onBlur={ev => {
            if (!ev.currentTarget.contains((ev as any).relatedTarget)) {
              // Skip blurring on child focus
              setIsFocused(false)
            }
          }}
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
              case 'Delete': {
                setShowDelete(true)
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
            orderBy={currentOrder}
            orderDirection={currentDirection}
            onRequestOrderChange={(field, dir) => {
              setCurrentOrder(field)
              setCurrentDirection(dir)
            }}
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
            onItemContextMenu={(ev, item) => {
              ev.preventDefault()
              setActiveContent(item)
              setContextMenuAnchor(ev.currentTarget as HTMLElement)
              setIsContextMenuOpened(true)
            }}
            fieldComponent={fieldOptions => {
              switch (fieldOptions.field) {
                case 'DisplayName':
                  return (
                    <DisplayNameComponent
                      content={fieldOptions.content}
                      device={device}
                      isActive={activeContent && fieldOptions.content.Id === activeContent.Id}
                    />
                  )
                case 'Actions':
                  return (
                    <TableCell style={{ width: '64px' }}>
                      <CurrentContentContext.Provider value={fieldOptions.content}>
                        <SecondaryActionsMenu />
                      </CurrentContentContext.Provider>
                    </TableCell>
                  )
              }
              if (
                typeof fieldOptions.content[fieldOptions.field] === 'object' &&
                isReferenceField(fieldOptions.field)
              ) {
                const expectedContent = fieldOptions.content[fieldOptions.field] as GenericContent
                if (
                  expectedContent &&
                  expectedContent.Id &&
                  expectedContent.Type &&
                  expectedContent.Name &&
                  expectedContent.Path
                ) {
                  return (
                    <TableCell padding={'none'}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {' '}
                        <Icon item={expectedContent as GenericContent} />
                        <div style={{ marginLeft: '1em' }}>
                          {(expectedContent as GenericContent).DisplayName || (expectedContent as GenericContent).Name}
                        </div>
                      </div>
                    </TableCell>
                  )
                }
                return null
              }
              if (typeof fieldOptions.content[fieldOptions.field] === 'boolean') {
                if (fieldOptions.content[fieldOptions.field] === true) {
                  return (
                    <TableCell>
                      <Check color="secondary" />
                    </TableCell>
                  )
                } else if (fieldOptions.content[fieldOptions.field] === false) {
                  return (
                    <TableCell>
                      <Close color="error" />
                    </TableCell>
                  )
                }
              }
              return null
            }}
            fieldsToDisplay={props.fieldsToDisplay || personalSettings.content.fields || ['DisplayName']}
            selected={selected}
            onRequestSelectionChange={setSelected}
            icons={{}}
          />
          {activeContent ? (
            <CurrentContentContext.Provider value={activeContent}>
              <ContentContextMenu
                menuProps={{
                  disablePortal: true,
                  anchorEl: contextMenuAnchor,
                  BackdropProps: {
                    onClick: () => setIsContextMenuOpened(false),
                    onContextMenu: ev => ev.preventDefault(),
                  },
                }}
                isOpened={isContextMenuOpened}
                onClose={() => setIsContextMenuOpened(false)}
                onOpen={() => setIsContextMenuOpened(true)}
              />
            </CurrentContentContext.Provider>
          ) : null}
        </div>
      </DropFileArea>
      <DeleteContentDialog content={selected} dialogProps={{ open: showDelete, onClose: () => setShowDelete(false) }} />
    </div>
  )
}
