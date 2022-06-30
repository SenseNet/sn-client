import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
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
import React, {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { TableCellProps } from 'react-virtualized'
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
      height: '100%',
      display: 'block',
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

export interface ContentListProps<T extends GenericContent> {
  enableBreadcrumbs?: boolean
  hideHeader?: boolean
  disableSelection?: boolean
  parentIdOrPath: number | string
  onParentChange: (newParent: T) => void
  onTabRequest?: () => void
  onActiveItemChange?: (item: T) => void
  onActivateItem: (item: T) => void
  style?: CSSProperties
  containerRef?: (r: HTMLDivElement | null) => void
  fieldsToDisplay?: Array<Extract<keyof T, string>>
  schema?: string
  onSelectionChange?: (sel: T[]) => void
  onFocus?: () => void
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
}

export const isReferenceField = (fieldName: string, repo: Repository, schema = 'GenericContent') => {
  const refWhiteList = ['AllowedChildTypes', 'AllRoles']
  const setting = repo.schemas.getSchemaByName(schema).FieldSettings.find((f) => f.Name === fieldName)
  return refWhiteList.some((field) => field === fieldName) || setting?.Type === 'ReferenceFieldSetting'
}

const rowHeightConst = 57
const headerHeightConst = 42

export const ContentList = <T extends GenericContent = GenericContent>(props: ContentListProps<T>) => {
  const selectionService = useSelectionService()
  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext) as T[]
  const ancestors = useContext(CurrentAncestorsContext) as T[]
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSettings)
  const loadSettings = useContext(LoadSettingsContext)
  const repo = useRepository()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const { openDialog } = useDialog()
  const logger = useLogger('ContentList')
  const localization = useLocalization()
  const [selected, setSelected] = useState<T[]>([])
  const [activeContent, setActiveContent] = useState<T>(children[0])
  const [isFocused, setIsFocused] = useState(true)
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [schema, setSchema] = useState(repo.schemas.getSchemaByName(props.schema || 'GenericContent'))
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })
  const loadChildrenSettingsOrderBy = loadSettings?.loadChildrenSettings.orderby
  const [currentOrder, setCurrentOrder] = useState<keyof T>(
    (loadChildrenSettingsOrderBy?.[0][0] as keyof T) || 'DisplayName',
  )
  const [currentDirection, setCurrentDirection] = useState<'asc' | 'desc'>(
    (loadChildrenSettingsOrderBy?.[0][1] as 'asc' | 'desc') || 'asc',
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
      expand: [
        'CheckedOutTo',
        ...(fields as string[]).reduce<any[]>((referenceFields, fieldName) => {
          if (fieldName.includes('/')) {
            const splittedFieldName = fieldName.split('/')
            if (splittedFieldName.length === 2 && splittedFieldName[1] === '') {
              if (isReferenceField(splittedFieldName[0], repo, props.schema)) {
                referenceFields.push(splittedFieldName[0])
              }
            } else if (
              repo.schemas.getFieldTypeByName(splittedFieldName[splittedFieldName.length - 1]) ===
              'ReferenceFieldSetting'
            ) {
              !referenceFields.includes(fieldName) && referenceFields.push(fieldName)
            } else {
              !referenceFields.includes(PathHelper.getParentPath(fieldName)) &&
                referenceFields.push(PathHelper.getParentPath(fieldName))
            }
          } else if (repo.schemas.getFieldTypeByName(fieldName) === 'ReferenceFieldSetting') {
            referenceFields.push(fieldName)
          }
          return referenceFields
        }, []),
      ],
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

  useEffect(() => {
    const schemaObservable = repo.schemas.subscribeToSchemas(() => {
      setSchema(repo.schemas.getSchemaByName(props.schema || 'GenericContent'))
    })
    return () => schemaObservable.dispose()
  }, [repo.schemas, props.schema])

  const onCloseFunc = () => setIsContextMenuOpened(false)
  const onOpenFunc = () => setIsContextMenuOpened(true)

  const handleActivateItem = useCallback(
    (item: T) => {
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
    (ev: KeyboardEvent) => {
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

  const onItemDoubleClickFunc = (rowMouseEventHandlerParams: { rowData: T }) =>
    handleActivateItem(rowMouseEventHandlerParams.rowData)

  const getSelectionControl = (isSelected: any, content: any, onChangeCallback: any) => (
    <SelectionControl {...{ isSelected, content, onChangeCallback }} />
  )

  const openContext = (ev: MouseEvent, rowData: T) => {
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
            <ActionsField
              onOpen={(ev) => openContext(ev, fieldOptions.rowData)}
              name={fieldOptions.rowData.Name as string}
            />
          </ContextMenuWrapper>
        )
      case 'Enabled':
        if (fieldOptions.rowData[fieldOptions.dataKey] !== undefined) {
          return (
            <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
              <EnabledField
                displayName={fieldOptions.rowData.DisplayName}
                enabled={fieldOptions.rowData[fieldOptions.dataKey] as boolean}
                description={fieldSettings?.Description ?? ''}
                onChange={async (value: boolean) => {
                  try {
                    await repo.patch({
                      idOrPath: fieldOptions.rowData.Id,
                      content: { [fieldOptions.dataKey]: value },
                    })
                  } catch (error) {
                    logger.error({
                      message: error.message || localization.contentList.errorContentModification,
                      data: {
                        relatedContent: fieldOptions.rowData,
                        relatedRepository: repo.configuration.repositoryUrl,
                        error,
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
      case 'SuccessfulCalls':
        return (
          <ContextMenuWrapper onContextMenu={(ev) => openContext(ev, fieldOptions.rowData)}>
            <VirtualDefaultCell
              onTextClick={() => {
                openDialog({
                  name: 'webhook-log',
                  props: { content: fieldOptions.rowData },
                })
              }}
              cellData={fieldOptions.cellData}
              textForLink=" (Click for details)"
            />
          </ContextMenuWrapper>
        )
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
      isReferenceField(fieldOptions.dataKey, repo, props.schema || fieldOptions.rowData.Type)
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

  const fieldReferenceFunc = (fieldOptions: TableCellProps) => {
    const splittedDatakey = fieldOptions.dataKey.split('/')

    if (splittedDatakey[splittedDatakey.length - 1] === '') {
      splittedDatakey.pop()
    }
    const lastInReference = splittedDatakey[splittedDatakey.length - 1]
    const displayField = splittedDatakey.reduce((acc, curr, _index, arr) => {
      if (!acc[curr]) {
        arr.length = 0
        return null
      } else if (!isReferenceField(curr, repo, acc.Type)) {
        arr.length = 0
        return acc
      }
      return acc[curr]
    }, fieldOptions.rowData)

    const cellData = displayField
      ? isReferenceField(lastInReference, repo, displayField.Type)
        ? displayField.DisplayName
        : displayField[lastInReference]
      : displayField

    const createdFieldOptions = {
      columnIndex: fieldOptions.columnIndex,
      dataKey: lastInReference,
      isScrolling: fieldOptions.isScrolling,
      rowData: {
        [lastInReference]: cellData,
        Id: displayField?.Id,
        Name: displayField?.Name,
        Type: displayField?.Type,
      },
      cellData,
      rowIndex: fieldOptions.rowIndex,
    }

    return fieldComponentFunc({
      tableCellProps: createdFieldOptions,
      fieldSettings: repo.schemas
        .getSchemaByName(displayField ? displayField.Type : '')
        .FieldSettings.find((setting) => setting.Name === lastInReference)!,
    })
  }

  const menuPropsObj = {
    disablePortal: true,
    anchorReference: 'anchorPosition' as const,
    anchorPosition: contextMenuAnchor,
    BackdropProps: {
      onClick: () => setIsContextMenuOpened(false),
      onContextMenu: (ev: { preventDefault: () => any }) => ev.preventDefault(),
    },
  }

  const displayNameInArray = ['DisplayName']

  return (
    <div style={{ ...props.style, ...{ height: '100%' } }} {...props.containerProps}>
      {props.enableBreadcrumbs ? (
        <div className={clsx(classes.breadcrumbsWrapper, globalClasses.centeredVertical)}>
          <ContentBreadcrumbs<T> onItemClick={(i) => props.onParentChange(i.content)} />
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
            referenceCellRenderer={fieldReferenceFunc}
            displayRowCheckbox={!props.disableSelection}
            fieldsToDisplay={
              (props.fieldsToDisplay?.map((field) => {
                const splittedField = field.split('/')
                if (splittedField.length === 2 && splittedField[1] === '') {
                  return splittedField[0]
                } else {
                  return field
                }
              }) ||
                personalSettings.content.fields ||
                displayNameInArray) as any
            }
            getSelectionControl={getSelectionControl}
            items={children}
            onRequestOrderChange={onRequestOrderChangeFunc}
            onRequestSelectionChange={setSelected}
            orderBy={currentOrder}
            orderDirection={currentDirection}
            schema={schema}
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
