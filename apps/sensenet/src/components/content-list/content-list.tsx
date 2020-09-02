import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import {
  CurrentAncestorsContext,
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useLogger,
  useRepository,
} from '@sensenet/hooks-react'
import { VirtualCellProps, VirtualDefaultCell, VirtualizedTable } from '@sensenet/list-controls-react'
import { createStyles, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ResponsiveContext, ResponsivePersonalSettings } from '../../context'
import { globals, useGlobalStyles } from '../../globalStyles'
import { useLocalization, useSelectionService } from '../../hooks'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useDialog } from '../dialogs'
import { DropFileArea } from '../DropFileArea'
import { SelectionControl } from '../SelectionControl'
import { ContextMenuWrapper } from './context-menu-wrapper'
import {
  ActionsField,
  BooleanField,
  DateField,
  DescriptionField,
  DisplayNameComponent,
  EmailField,
  EnabledField,
  IconField,
  LockedField,
  PhoneField,
  ReferenceField,
  RolesField,
} from '.'

const useStyles = makeStyles(() => {
  return createStyles({
    tableWrapper: {
      display: 'flex',
      flex: 1,
      height: '100%',
      userSelect: 'none',
      outline: 'none',
      position: 'relative',
    },
    breadcrumbsWrapper: {
      height: globals.common.drawerItemHeight,
      boxSizing: 'border-box',
      borderBottom: '1px solid rgba(255, 255, 255, 0.11)',
      paddingLeft: '15px',
    },
  })
})

export interface ContentListProps {
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
  schema?: string
  onSelectionChange?: (sel: GenericContent[]) => void
  onFocus?: () => void
  containerProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

export const isReferenceField = (fieldName: string, repo: Repository, schema = 'GenericContent') => {
  const refWhiteList = ['AllowedChildTypes', 'AllRoles']
  const setting = repo.schemas.getSchemaByName(schema).FieldSettings.find((f) => f.Name === fieldName)
  return refWhiteList.indexOf(fieldName) !== -1 || (setting && setting.Type === 'ReferenceFieldSetting') || false
}

const rowHeightConst = 57
const headerHeightConst = 42

export const ContentList: React.FunctionComponent<ContentListProps> = (props) => {
  const selectionService = useSelectionService()
  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext)
  const ancestors = useContext(CurrentAncestorsContext)
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSettings)
  const loadSettings = useContext(LoadSettingsContext)
  const repo = useRepository()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const { openDialog } = useDialog()
  const logger = useLogger('ContentList')
  const localization = useLocalization()
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
    setSelected([])
  }, [children])

  useEffect(() => {
    props.onActiveItemChange?.(activeContent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContent])

  useEffect(() => {
    isFocused && props.onFocus && props.onFocus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused])

  useEffect(() => {
    props.onSelectionChange?.(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  useEffect(() => {
    const fields = props.fieldsToDisplay || personalSettings.content.fields
    loadSettings.setLoadChildrenSettings({
      ...loadSettings.loadChildrenSettings,
      expand: ['CheckedOutTo', ...fields.filter((fieldName) => isReferenceField(fieldName, repo, props.schema))],
      orderby: [[currentOrder as any, currentDirection as any]],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDirection, currentOrder, personalSettings.content.fields, props.fieldsToDisplay, repo])

  useEffect(() => {
    setSelected([])
  }, [parentContent.Id])

  useEffect(() => {
    selectionService.selection.setValue(selected)
  }, [selected, selectionService.selection])

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
    (rowMouseEventHandlerParams) => {
      if (device !== 'desktop' && activeContent && activeContent.Id === rowMouseEventHandlerParams.rowData.Id) {
        handleActivateItem(rowMouseEventHandlerParams.rowData)
        return
      }
      if (rowMouseEventHandlerParams.event.ctrlKey) {
        if (selected.find((s) => s.Id === rowMouseEventHandlerParams.rowData.Id)) {
          setSelected(selected.filter((s) => s.Id !== rowMouseEventHandlerParams.rowData.Id))
        } else {
          setSelected([...selected, rowMouseEventHandlerParams.rowData])
        }
      } else if (rowMouseEventHandlerParams.event.shiftKey) {
        const activeIndex = (activeContent && children.findIndex((s) => s.Id === activeContent.Id)) || 0
        const clickedIndex = children.findIndex((s) => s.Id === rowMouseEventHandlerParams.rowData.Id)
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
            activeContent && children[Math.max(0, children.findIndex((c) => c.Id === activeContent.Id) - 1)],
          )
          break
        case 'ArrowDown':
          setActiveContent(
            activeContent &&
              children[Math.min(children.findIndex((c) => c.Id === activeContent.Id) + 1, children.length - 1)],
          )
          break
        case ' ': {
          ev.preventDefault()
          activeContent && selected.findIndex((s) => s.Id === activeContent.Id) !== -1
            ? setSelected([...selected.filter((s) => s.Id !== activeContent.Id)])
            : activeContent && setSelected([...selected, activeContent])
          break
        }
        case 'Insert': {
          activeContent && selected.findIndex((s) => s.Id === activeContent.Id) !== -1
            ? setSelected([...selected.filter((s) => s.Id !== activeContent.Id)])
            : activeContent && setSelected([...selected, activeContent])
          activeContent &&
            setActiveContent(
              children[Math.min(children.findIndex((c) => c.Id === activeContent.Id) + 1, children.length)],
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
          props.onTabRequest?.()
          break
        default:
          return true
      }
    },
    [activeContent, children, props, selected, handleActivateItem, ancestors, openDialog],
  )

  const onRequestOrderChangeFunc = (field: keyof GenericContent, dir: 'asc' | 'desc') => {
    setCurrentOrder(field)
    setCurrentDirection(dir)
  }

  const onItemDoubleClickFunc = (rowMouseEventHandlerParams: { rowData: GenericContent }) =>
    handleActivateItem(rowMouseEventHandlerParams.rowData)

  const getSelectionControl = (isSelected: any, content: any, onChangeCallback: any) => (
    <SelectionControl {...{ isSelected, content, onChangeCallback }} />
  )

  const openContext = (ev: React.MouseEvent, rowData: GenericContent) => {
    ev.preventDefault()
    ev.stopPropagation()
    setActiveContent(rowData)
    setContextMenuAnchor({ top: ev.clientY, left: ev.clientX })
    setIsContextMenuOpened(true)
  }

  const fieldComponentFunc = ({ tableCellProps: fieldOptions, fieldSettings }: VirtualCellProps) => {
    switch (fieldOptions.dataKey) {
      case 'Locked':
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <LockedField content={fieldOptions.rowData} />
          </ContextMenuWrapper>
        )
      case 'Icon':
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <IconField content={fieldOptions.rowData} />
          </ContextMenuWrapper>
        )
      case 'Email' as any:
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <EmailField mail={fieldOptions.rowData[fieldOptions.dataKey] as string} />
          </ContextMenuWrapper>
        )
      case 'Phone' as any:
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <PhoneField phoneNo={fieldOptions.rowData[fieldOptions.dataKey] as string} />
          </ContextMenuWrapper>
        )
      case 'DisplayName':
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <DisplayNameComponent
              content={fieldOptions.rowData}
              device={device}
              isActive={activeContent && fieldOptions.rowData.Id === activeContent.Id}
            />
          </ContextMenuWrapper>
        )
      case 'Description':
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <DescriptionField text={fieldOptions.rowData[fieldOptions.dataKey] as string} />
          </ContextMenuWrapper>
        )
      case 'Actions':
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <ActionsField onOpen={(ev) => openContext(ev, fieldOptions.rowData)} />
          </ContextMenuWrapper>
        )
      case 'Enabled':
        if (fieldOptions.rowData[fieldOptions.dataKey] !== undefined) {
          return (
            <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
              <EnabledField
                enabled={fieldOptions.rowData[fieldOptions.dataKey] as boolean}
                description={fieldSettings.Description ?? ''}
                onChange={async (value: boolean) => {
                  try {
                    await repo.patch({
                      idOrPath: fieldOptions.rowData.Id,
                      content: { [fieldOptions.dataKey]: value },
                    })
                  } catch (error) {
                    logger.error({
                      message: localization.contentList.errorContentModification,
                      data: {
                        relatedContent: fieldOptions.rowData,
                        details: { error },
                      },
                    })
                    return false
                  }

                  return true
                }}
              />
            </ContextMenuWrapper>
          )
        }
        return null
      case 'AllRoles':
        if (Array.isArray(fieldOptions.rowData[fieldOptions.dataKey])) {
          return (
            <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
              <RolesField
                roles={fieldOptions.rowData[fieldOptions.dataKey] as GenericContent[]}
                directRoles={fieldOptions.rowData.DirectRoles}
              />
            </ContextMenuWrapper>
          )
        }
        return null
      default:
        break
    }
    if (fieldSettings && fieldSettings.FieldClassName === 'SenseNet.ContentRepository.Fields.DateTimeField') {
      return (
        <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
          <DateField date={fieldOptions.rowData[fieldOptions.dataKey] as string} />
        </ContextMenuWrapper>
      )
    }

    if (
      typeof fieldOptions.rowData[fieldOptions.dataKey] === 'object' &&
      isReferenceField(fieldOptions.dataKey, repo, props.schema)
    ) {
      const expectedContent = fieldOptions.rowData[fieldOptions.dataKey] as GenericContent
      if (
        (expectedContent &&
          expectedContent.Id &&
          expectedContent.Type &&
          expectedContent.Name &&
          expectedContent.Path) ||
        Array.isArray(expectedContent)
      ) {
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <ReferenceField content={expectedContent} fieldName={fieldOptions.dataKey} parent={fieldOptions.rowData} />
          </ContextMenuWrapper>
        )
      }
      return null
    }
    if (typeof fieldOptions.rowData[fieldOptions.dataKey] === 'boolean') {
      return (
        <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
          <BooleanField value={fieldOptions.rowData[fieldOptions.dataKey] as boolean | undefined} />
        </ContextMenuWrapper>
      )
    }
    return (
      <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
        <VirtualDefaultCell cellData={fieldOptions.cellData} />
      </ContextMenuWrapper>
    )
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
      {props.enableBreadcrumbs ? (
        <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
          <ContentBreadcrumbs onItemClick={(i) => props.onParentChange(i.content)} />
        </div>
      ) : null}
      <DropFileArea parentContent={parentContent} style={{ height: '100%', overflow: 'hidden' }}>
        <div
          className={classes.tableWrapper}
          tabIndex={0}
          onClick={() => {
            setIsFocused(true)
          }}
          onBlur={(ev) => {
            if (!ev.currentTarget.contains((ev as any).relatedTarget)) {
              // Skip blurring on child focus
              setIsFocused(false)
            }
          }}
          ref={props.containerRef}
          onKeyDown={handleKeyDown}>
          <VirtualizedTable
            active={activeContent}
            checkboxProps={{ color: 'primary' }}
            cellRenderer={fieldComponentFunc}
            displayRowCheckbox={!props.disableSelection}
            fieldsToDisplay={props.fieldsToDisplay || personalSettings.content.fields || displayNameInArray}
            getSelectionControl={getSelectionControl}
            items={children}
            onRequestOrderChange={onRequestOrderChangeFunc}
            onRequestSelectionChange={setSelected}
            orderBy={currentOrder}
            orderDirection={currentDirection}
            schema={repo.schemas.getSchemaByName(props.schema || 'GenericContent')}
            selected={selected}
            tableProps={{
              rowCount: children.length,
              rowHeight: rowHeightConst,
              headerHeight: headerHeightConst,
              rowGetter: ({ index }) => children[index],
              onRowClick: (rowMouseEventHandlerParams) => {
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
        </div>
      </DropFileArea>
    </div>
  )
}
