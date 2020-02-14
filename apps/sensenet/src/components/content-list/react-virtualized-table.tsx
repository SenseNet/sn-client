import { Paper } from '@material-ui/core'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { VirtualCellProps, VirtualDefaultCell, VirtualizedTable } from '@sensenet/list-controls-react'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useRepository,
} from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types'
import { Repository } from '@sensenet/client-core'
import { debounce } from '@sensenet/client-utils'
import { ResponsiveContext, ResponsivePersonalSetttings } from '../../context'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useSelectionService } from '../../hooks'
import { SelectionControl } from '../SelectionControl'
import { useDialog } from '../dialogs'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { DropFileArea } from '../DropFileArea'
import { ReferenceField } from './reference-field'
import { LockedField } from './locked-field'
import { IconField } from './icon-field'
import { EmailField } from './email-field'
import { PhoneField } from './phone-field'
import { DisplayNameComponent } from './display-name-field'
import { DescriptionField } from './description-field'
import { ActionsField } from './actions-field'
import { DateField } from './date-field'
import { BooleanField } from './boolean-field'

export interface ReactVirtualizedTableProps {
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

export const ReactVirtualizedTable: React.FunctionComponent<ReactVirtualizedTableProps> = props => {
  const selectionService = useSelectionService()
  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext)
  const ancestors = useContext(CurrentAncestorsContext)
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSetttings)
  const loadSettings = useContext(LoadSettingsContext)
  const repo = useRepository()

  const { openDialog } = useDialog()

  const [selected, setSelected] = useState<GenericContent[]>([])
  const [activeContent, setActiveContent] = useState<GenericContent>(children[0])
  const [isFocused, setIsFocused] = useState(true)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const loadChildrenSettingsOrderBy = loadSettings?.loadChildrenSettings.orderby
  const [currentOrder, setCurrentOrder] = useState<keyof GenericContent>(
    ((loadChildrenSettingsOrderBy && loadChildrenSettingsOrderBy[0][0]) as keyof GenericContent) || 'DisplayName',
  )
  const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>(
    (loadChildrenSettingsOrderBy && (loadChildrenSettingsOrderBy[0][1] as any)) || 'asc',
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
    const fields = props.fieldsToDisplay || personalSettings.content.fields
    loadSettings.setLoadChildrenSettings({
      ...loadSettings.loadChildrenSettings,
      expand: ['CheckedOutTo', ...fields.filter(fieldName => isReferenceField(fieldName, repo))],
      orderby: [[currentOrder as any, currentDirection as any]],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDirection, currentOrder, personalSettings.content.fields, props.fieldsToDisplay, repo])

  useEffect(() => {
    setSelected([])
  }, [parentContent.Id])

  useEffect(() => {
    setIsContextMenuOpened(false)
  }, [children, activeContent, selected])

  useEffect(() => {
    selectionService.selection.setValue(selected)
  }, [selected, selectionService.selection])

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

  const onCloseFunc = () => setIsContextMenuOpened(false)
  const onOpenFunc = () => setIsContextMenuOpened(true)

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
    rowMouseEventHandlerParams => {
      if (device !== 'desktop' && activeContent && activeContent.Id === rowMouseEventHandlerParams.rowData.Id) {
        handleActivateItem(rowMouseEventHandlerParams.rowData)
        return
      }
      if (rowMouseEventHandlerParams.event.ctrlKey) {
        if (selected.find(s => s.Id === rowMouseEventHandlerParams.rowData.Id)) {
          setSelected(selected.filter(s => s.Id !== rowMouseEventHandlerParams.rowData.Id))
        } else {
          setSelected([...selected, rowMouseEventHandlerParams.rowData])
        }
      } else if (rowMouseEventHandlerParams.event.shiftKey) {
        const activeIndex = (activeContent && children.findIndex(s => s.Id === activeContent.Id)) || 0
        const clickedIndex = children.findIndex(s => s.Id === rowMouseEventHandlerParams.rowData.Id)
        const newSelection = Array.from(
          new Set([
            ...selected,
            ...[...children].slice(Math.min(activeIndex, clickedIndex), Math.max(activeIndex, clickedIndex) + 1),
          ]),
        )
        setSelected(newSelection)
      } else if (
        !selected.length ||
        (selected.length === 1 && selected[0].Id !== rowMouseEventHandlerParams.rowData.Id)
      ) {
        setSelected([rowMouseEventHandlerParams.rowData])
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

  const onRequestOrderChangeFunc = (field: any, dir: any) => {
    setCurrentOrder(field)
    setCurrentDirection(dir)
  }

  const onItemDoubleClickFunc = (rowMouseEventHandlerParams: { rowData: GenericContent }) =>
    handleActivateItem(rowMouseEventHandlerParams.rowData)

  const getSelectionControl = (isSelected: any, content: any, onChangeCallback: any) => (
    <SelectionControl {...{ isSelected, content, onChangeCallback }} />
  )

  const fieldComponentFunc = ({ tableCellProps: fieldOptions, fieldSettings }: VirtualCellProps) => {
    switch (fieldOptions.dataKey) {
      case 'Locked':
        return <LockedField content={fieldOptions.rowData} />
      case 'Icon':
        return <IconField content={fieldOptions.rowData} />
      case 'Email' as any:
        return <EmailField mail={fieldOptions.rowData[fieldOptions.dataKey] as string} />
      case 'Phone' as any:
        return <PhoneField phoneNo={fieldOptions.rowData[fieldOptions.dataKey] as string} />
      case 'DisplayName':
        return (
          <DisplayNameComponent
            content={fieldOptions.rowData}
            device={device}
            isActive={activeContent && fieldOptions.rowData.Id === activeContent.Id}
          />
        )
      case 'Description':
        return <DescriptionField text={fieldOptions.rowData[fieldOptions.dataKey] as string} />
      case 'Actions':
        return (
          <ActionsField
            onOpen={async ev => {
              ev.preventDefault()
              ev.stopPropagation()
              ev.persist()
              await setActiveContent(fieldOptions.rowData)
              await setContextMenuAnchor({ top: ev.clientY, left: ev.clientX })
              await setIsContextMenuOpened(true)
            }}
          />
        )
      default:
        break
    }
    if (fieldSettings && fieldSettings.FieldClassName === 'SenseNet.ContentRepository.Fields.DateTimeField') {
      return <DateField date={fieldOptions.rowData[fieldOptions.dataKey] as string} />
    }

    if (
      typeof fieldOptions.rowData[fieldOptions.dataKey] === 'object' &&
      isReferenceField(fieldOptions.dataKey, repo)
    ) {
      const expectedContent = fieldOptions.rowData[fieldOptions.dataKey] as GenericContent
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
    if (typeof fieldOptions.rowData[fieldOptions.dataKey] === 'boolean') {
      return <BooleanField value={fieldOptions.rowData[fieldOptions.dataKey] as boolean | undefined} />
    }
    return <VirtualDefaultCell cellData={fieldOptions.cellData} />
  }

  const menuPropsObj = {
    disablePortal: true,
    anchorReference: 'anchorPosition' as 'anchorPosition',
    anchorPosition: contextMenuAnchor,
    BackdropProps: {
      onClick: () => setIsContextMenuOpened(false),
      onContextMenu: (ev: { preventDefault: () => any }) => ev.preventDefault(),
    },
  }

  const displayNameInArray = ['DisplayName']

  return (
    <div style={{ ...props.style }} {...props.containerProps}>
      {props.enableBreadcrumbs ? <ContentBreadcrumbs onItemClick={i => props.onParentChange(i.content)} /> : null}
      <DropFileArea
        parentContent={parentContent}
        style={{ height: props.parentIdOrPath !== 0 ? 'calc(100% - 36px)' : '100%', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
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
          <Paper
            style={{
              height: '100%',
              width: '100%',
              background: 'transparent',
              position: 'relative',
              overflowY: 'hidden',
            }}>
            <VirtualizedTable
              active={activeContent}
              cellRenderer={fieldComponentFunc}
              displayRowCheckbox={!props.disableSelection}
              fieldsToDisplay={props.fieldsToDisplay || personalSettings.content.fields || displayNameInArray}
              getSelectionControl={getSelectionControl}
              items={children}
              onRequestOrderChange={onRequestOrderChangeFunc}
              onRequestSelectionChange={setSelected}
              orderBy={currentOrder}
              orderDirection={currentDirection}
              schema={repo.schemas.getSchemaByName('GenericContent')}
              selected={selected}
              tableProps={{
                rowCount: children.length,
                rowHeight: 57,
                headerHeight: 42,
                rowGetter: ({ index }) => children[index],
                onRowClick: rowMouseEventHandlerParams => {
                  setActiveContent(rowMouseEventHandlerParams.rowData)
                  handleItemClick(rowMouseEventHandlerParams)
                },
                onRowDoubleClick: onItemDoubleClickFunc,
                disableHeader: props.hideHeader,
              }}
            />
            {activeContent ? (
              <ContentContextMenu
                content={activeContent}
                isOpened={isContextMenuOpened}
                menuProps={menuPropsObj}
                onClose={onCloseFunc}
                onOpen={onOpenFunc}
              />
            ) : null}
          </Paper>
        </div>
      </DropFileArea>
      {activeContent ? (
        <ContentContextMenu
          content={activeContent}
          menuProps={menuPropsObj}
          isOpened={isContextMenuOpened}
          onClose={onCloseFunc}
          onOpen={onOpenFunc}
        />
      ) : null}
    </div>
  )
}
