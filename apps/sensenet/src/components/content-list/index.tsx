import { debounce } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { ContentList, DefaultCell } from '@sensenet/list-controls-react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Repository } from '@sensenet/client-core'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  CurrentContentProvider,
  LoadSettingsContext,
  useRepository,
} from '@sensenet/hooks-react'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../../context'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { ContentContextMenu, CONTEXT_MENU_SCENARIO } from '../context-menu/content-context-menu'
import { DropFileArea } from '../DropFileArea'
import { SelectionControl } from '../SelectionControl'
import { useDialog } from '../dialogs'
import { IconField } from './icon-field'
import { EmailField } from './email-field'
import { PhoneField } from './phone-field'
import { DisplayNameComponent } from './display-name-field'
import { ActionsField } from './actions-field'
import { ReferenceField } from './reference-field'
import { BooleanField } from './boolean-field'
import { DateField } from './date-field'
import { DescriptionField } from './description-field'
import { LockedField } from './locked-field'

export interface CollectionComponentProps {
  enableBreadcrumbs?: boolean
  hideHeader?: boolean
  disableSelection?: boolean
  parentIdOrPath: number | string
  onParentChange: (newParent: GenericContent) => void
  onTabRequest?: () => void
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

export const isReferenceField = (fieldName: string, repo: Repository) => {
  const refWhiteList = ['AllowedChildTypes']
  const setting = repo.schemas.getSchemaByName('GenericContent').FieldSettings.find(f => f.Name === fieldName)
  return refWhiteList.indexOf(fieldName) !== -1 || (setting && setting.Type === 'ReferenceFieldSetting') || false
}

//TODO: Move this from index.ts to its own file and create a barrel
export const CollectionComponent: React.FunctionComponent<CollectionComponentProps> = props => {
  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext)
  const ancestors = useContext(CurrentAncestorsContext)
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const [activeContent, setActiveContent] = useState<GenericContent>(children[0])
  const [selected, setSelected] = useState<GenericContent[]>([])
  const [isFocused, setIsFocused] = useState(true)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  const { openDialog } = useDialog()
  const repo = useRepository()
  const loadSettings = useContext(LoadSettingsContext)

  const [currentOrder, setCurrentOrder] = useState<keyof GenericContent>(
    ((loadSettings.loadChildrenSettings.orderby &&
      loadSettings.loadChildrenSettings.orderby[0][0]) as keyof GenericContent) || 'DisplayName',
  )
  const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>(
    (loadSettings.loadChildrenSettings.orderby && (loadSettings.loadChildrenSettings.orderby[0][1] as any)) || 'asc',
  )

  useEffect(() => {
    props.onActiveItemChange && props.onActiveItemChange(activeContent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContent])

  useEffect(() => {
    isFocused && props.onFocus && props.onFocus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused])

  useEffect(() => {
    props.onSelectionChange && props.onSelectionChange(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    loadSettings.setLoadChildrenSettings({
      ...loadSettings.loadChildrenSettings,
      expand: ['CheckedOutTo'],
      orderby: [[currentOrder as any, currentDirection as any]],
    })
    // loadSettings can NOT be added :(
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentContent, currentOrder, currentDirection, personalSettings.content.fields, repo.schemas, isReferenceField])

  useEffect(() => {
    setSelected([])
  }, [parentContent.Id])

  useEffect(() => {
    setIsContextMenuOpened(false)
  }, [children, activeContent, selected])

  const [searchString, setSearchString] = useState('')
  const runSearch = useCallback(
    debounce(() => {
      const child = children.find(
        c =>
          c.Name.toLocaleLowerCase().indexOf(searchString) === 0 ||
          (c.DisplayName && c.DisplayName.toLocaleLowerCase().indexOf(searchString)) === 0,
      )
      child && setActiveContent(child)
      setSearchString('')
    }, 500),
    [],
  )

  const handleActivateItem = useCallback(
    (item: GenericContent) => {
      if (item.IsFolder) {
        props.onParentChange(item)
      } else {
        props.onActivateItem(item)
      }
    },
    [props],
  )

  const handleItemClick = useCallback(
    (ev: React.MouseEvent, content: GenericContent) => {
      if (device !== 'desktop' && activeContent && activeContent.Id === content.Id) {
        handleActivateItem(content)
        return
      }
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
            ...[...children].slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1),
          ]),
        )
        setSelected(newSelection)
      } else if (!selected.length || (selected.length === 1 && selected[0].Id !== content.Id)) {
        setSelected([content])
      }
    },
    [activeContent, children, device, handleActivateItem, selected],
  )

  const handleKeyDown = useCallback(
    (ev: React.KeyboardEvent) => {
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
          openDialog({ name: 'delete', props: { content: selected } })
          break
        }
        case 'Tab':
          ev.preventDefault()
          props.onTabRequest && props.onTabRequest()
          break
        default:
          if (ev.key.length === 1) {
            setSearchString(searchString + ev.key)
            runSearch()
          }
      }
    },
    [activeContent, children, props, selected, handleActivateItem, ancestors, openDialog, searchString, runSearch],
  )

  return (
    <div style={{ ...props.style }} {...props.containerProps}>
      {props.enableBreadcrumbs ? <ContentBreadcrumbs onItemClick={i => props.onParentChange(i.content)} /> : null}
      <DropFileArea parentContent={parentContent} style={{ height: '100%', overflow: 'hidden' }}>
        <div
          style={{
            height: 'calc(100% - 36px)',
            overflow: 'auto',
            userSelect: 'none',
            outline: 'none',
          }}
          tabIndex={0}
          onClick={() => {
            setIsFocused(true)
          }}
          onBlur={ev => {
            if (!ev.currentTarget.contains((ev as any).relatedTarget)) {
              // Skip blurring on child focus
              setIsFocused(false)
            }
          }}
          ref={props.containerRef}
          onKeyDown={handleKeyDown}>
          <ContentList
            hideHeader={props.hideHeader}
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
            onItemClick={handleItemClick}
            onItemDoubleClick={(_ev, item) => handleActivateItem(item)}
            displayRowCheckbox={!props.disableSelection}
            getSelectionControl={(isSelected, content) => <SelectionControl {...{ isSelected, content }} />}
            onItemContextMenu={(ev, item) => {
              ev.preventDefault()
              setActiveContent(item)
              setContextMenuAnchor({ top: ev.clientY, left: ev.clientX })
              setIsContextMenuOpened(true)
            }}
            fieldComponent={fieldOptions => {
              // eslint-disable-next-line default-case
              switch (fieldOptions.field) {
                case 'Locked':
                  return <LockedField content={fieldOptions.content} />
                case 'Icon':
                  return <IconField content={fieldOptions.content} />
                case 'Email' as any:
                  return <EmailField mail={fieldOptions.content[fieldOptions.field] as string} />
                case 'Phone' as any:
                  return <PhoneField phoneNo={fieldOptions.content[fieldOptions.field] as string} />
                case 'DisplayName':
                  return (
                    <DisplayNameComponent
                      content={fieldOptions.content}
                      device={device}
                      isActive={activeContent && fieldOptions.content.Id === activeContent.Id}
                    />
                  )
                case 'Description':
                  return <DescriptionField text={fieldOptions.content[fieldOptions.field] as string} />
                case 'Actions':
                  return (
                    <ActionsField
                      onOpen={ev => {
                        ev.preventDefault()
                        ev.stopPropagation()
                        setActiveContent(fieldOptions.content)
                        setContextMenuAnchor({ top: ev.clientY, left: ev.clientX })
                        setIsContextMenuOpened(true)
                      }}
                    />
                  )
                // no default
              }
              if (
                fieldOptions.fieldSetting &&
                fieldOptions.fieldSetting.FieldClassName === 'SenseNet.ContentRepository.Fields.DateTimeField'
              ) {
                return <DateField date={fieldOptions.content[fieldOptions.field] as string} />
              }

              if (
                typeof fieldOptions.content[fieldOptions.field] === 'object' &&
                isReferenceField(fieldOptions.field, repo)
              ) {
                const expectedContent = fieldOptions.content[fieldOptions.field] as GenericContent
                if (
                  expectedContent &&
                  expectedContent.Id &&
                  expectedContent.Type &&
                  expectedContent.Name &&
                  expectedContent.Path
                ) {
                  return <ReferenceField content={expectedContent} />
                }
                return null
              }
              if (typeof fieldOptions.content[fieldOptions.field] === 'boolean') {
                return <BooleanField value={fieldOptions.content[fieldOptions.field] as boolean | undefined} />
              }
              return <DefaultCell {...fieldOptions} />
            }}
            fieldsToDisplay={props.fieldsToDisplay || personalSettings.content.fields || ['DisplayName']}
            selected={selected}
            onRequestSelectionChange={setSelected}
            icons={{}}
          />
          {activeContent ? (
            <CurrentContentProvider
              idOrPath={activeContent.Id}
              oDataOptions={{
                select: ['Actions'],
                metadata: 'full',
                expand: ['Actions'],
                scenario: CONTEXT_MENU_SCENARIO,
              }}>
              <ContentContextMenu
                menuProps={{
                  disablePortal: true,
                  anchorReference: 'anchorPosition',
                  anchorPosition: contextMenuAnchor,
                  BackdropProps: {
                    onClick: () => setIsContextMenuOpened(false),
                    onContextMenu: ev => ev.preventDefault(),
                  },
                }}
                isOpened={isContextMenuOpened}
                onClose={() => setIsContextMenuOpened(false)}
                onOpen={() => setIsContextMenuOpened(true)}
              />
            </CurrentContentProvider>
          ) : null}
        </div>
      </DropFileArea>
    </div>
  )
}
