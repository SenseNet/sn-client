import { createStyles, makeStyles } from '@material-ui/core'
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
import { ColumnSetting } from '@sensenet/list-controls-react/src/ContentList/content-list-base-props'
import { clsx } from 'clsx'
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
import { useLocalization, usePersonalSettings, useSelectionService } from '../../hooks'
import { ContentBreadcrumbs } from '../ContentBreadcrumbs'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useDialog } from '../dialogs'
import { DropFileArea } from '../DropFileArea'
import { SelectionControl } from '../SelectionControl'
import { SETTINGS_FOLDER_FILTER } from '../tree/tree-with-data'
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
  fieldsToDisplay?: Array<ColumnSetting<GenericContent>>
  schema?: string
  onSelectionChange?: (sel: T[]) => void
  onFocus?: () => void
  containerProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  disableColumnSettings?: boolean
}

export const isReferenceField = (fieldName: string, repo: Repository, schema = 'GenericContent') => {
  const refWhiteList = ['AllowedChildTypes', 'AllRoles']
  const setting = repo.schemas.getSchemaByName(schema).FieldSettings.find((f) => f.Name === fieldName)
  return refWhiteList.some((field) => field === fieldName) || setting?.Type === 'ReferenceFieldSetting'
}

const rowHeightConst = 67
const headerHeightConst = 48

/**
 * Compare passed minutes with
 * @param value The base value.
 * @param timeDifference The minimum elapsed time time in minutes in Miliseconds.( Dafault 5 minutes )
 * @returns Returns true if the base value is greater than the compared value.
 */

// a function which expect a Date and it will compare with the current time and if the passed interval is greater than the current time it will return true
const isExpired = (value: Date, timeDifference = 300000) => {
  const currentTime = new Date().getTime()
  const valueTime = value.getTime()
  return currentTime - valueTime > timeDifference
}

interface ColumnSettingsContainerType {
  [key: string]: {
    columns: Array<ColumnSetting<GenericContent>>
    lastValidation: Date
  }
}

const ColumnSettingsContainer: ColumnSettingsContainerType = {}

export const ContentList = <T extends GenericContent = GenericContent>(props: ContentListProps<T>) => {
  const selectionService = useSelectionService()
  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext) as T[]
  const ancestors = useContext(CurrentAncestorsContext) as T[]
  const device = useContext(ResponsiveContext)
  const personalSettings = useContext(ResponsivePersonalSettings)
  const userPersonalSettings = usePersonalSettings()
  const loadSettings = useContext(LoadSettingsContext)
  const repo = useRepository()
  const classes = useStyles()
  const globalClasses = useGlobalStyles()
  const { openDialog, closeLastDialog } = useDialog()
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

  const [columnSettings, setColumnSettings] = useState<Array<ColumnSetting<GenericContent>>>(
    personalSettings.content.fields,
  )

  const fetchUrl = PathHelper.joinPaths(
    repo.configuration.repositoryUrl,
    repo.configuration.oDataToken,
    PathHelper.getContentUrl(props.parentIdOrPath),
  )

  /* Handle Column Settings */
  useEffect(() => {
    const ac = new AbortController()

    const getColumnSettings = async () => {
      const currentPathSettingCache = ColumnSettingsContainer[props.parentIdOrPath]
      if (
        !currentPathSettingCache ||
        !currentPathSettingCache?.columns?.length ||
        isExpired(new Date(currentPathSettingCache.lastValidation))
      ) {
        const endpoint = 'GetSettings'
        const queryParameters = { name: 'ColumnSettings' }
        const search = new URLSearchParams(queryParameters).toString()

        const requestUrl = `${fetchUrl}/${endpoint}?${search}`

        let data: { columns: Array<ColumnSetting<GenericContent>> } | undefined

        try {
          const response = await repo.fetch(requestUrl, {
            method: 'GET',
            credentials: 'include',
            signal: ac.signal,
          })

          data = await response.json()
          // Continue processing data...
        } catch (error) {
          /*empty*/
        }

        if (!data?.columns) {
          return
        }

        ColumnSettingsContainer[props.parentIdOrPath] = { columns: data.columns, lastValidation: new Date() }
      }

      /* Add Actions if field Settings Does not contain it. */
      if (!ColumnSettingsContainer[props.parentIdOrPath]?.columns?.find((f) => f.field === 'Actions')) {
        ColumnSettingsContainer[props.parentIdOrPath].columns.push({ field: 'Actions', title: 'Actions' })
      }

      setColumnSettings(ColumnSettingsContainer[props.parentIdOrPath].columns)
    }

    if (!props.fieldsToDisplay) {
      getColumnSettings()

      return () => {
        ac.abort()
      }
    }

    setColumnSettings(props.fieldsToDisplay)
  }, [props.fieldsToDisplay, props.parentIdOrPath, repo, fetchUrl])

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
    const fields = columnSettings || personalSettings.content.fields

    loadSettings.setLoadChildrenSettings({
      ...loadSettings.loadChildrenSettings,
      expand: [
        'CheckedOutTo',
        ...fields.reduce<Array<keyof GenericContent>>((referenceFields, fieldName) => {
          if (fieldName.field.includes('/')) {
            const splittedFieldName = fieldName.field.split('/')
            if (splittedFieldName.length === 2 && splittedFieldName[1] === '') {
              if (isReferenceField(splittedFieldName[0], repo, props.schema)) {
                referenceFields.push(splittedFieldName[0] as keyof GenericContent)
              }
            } else if (
              repo.schemas.getFieldTypeByName(splittedFieldName[splittedFieldName.length - 1]) ===
              'ReferenceFieldSetting'
            ) {
              !referenceFields.includes(fieldName.field) && referenceFields.push(fieldName.field)
            } else {
              !referenceFields.includes(PathHelper.getParentPath(fieldName.field) as keyof GenericContent) &&
                referenceFields.push(PathHelper.getParentPath(fieldName.field) as keyof GenericContent)
            }
          } else if (repo.schemas.getFieldTypeByName(fieldName.field) === 'ReferenceFieldSetting') {
            referenceFields.push(fieldName.field)
          }
          return referenceFields
        }, []),
      ],
      orderby: [[currentOrder as any, currentDirection as any]],
      filter: !userPersonalSettings.showHiddenItems ? `(${SETTINGS_FOLDER_FILTER})` : '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentDirection,
    currentOrder,
    personalSettings.content.fields,
    userPersonalSettings.showHiddenItems,
    props.fieldsToDisplay,
    repo,
    columnSettings,
  ])

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
                user={fieldOptions.rowData}
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
            <ReferenceField
              content={expectedContent}
              fieldName={fieldOptions.dataKey}
              parent={fieldOptions.rowData}
              showIcon={false}
            />
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

  const setCostumColumnSettings = async (newSettings: { columns: Array<ColumnSetting<GenericContent>> }) => {
    ColumnSettingsContainer[props.parentIdOrPath] = { columns: newSettings.columns, lastValidation: new Date() }

    const endpoint = 'WriteSettings'

    const requestUrl = `${fetchUrl}/${endpoint}`

    const data = {
      name: 'ColumnSettings',
      settingsData: newSettings,
    }

    try {
      await repo.fetch(requestUrl, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error(error)
    }
    setColumnSettings(newSettings.columns)
    closeLastDialog()
  }

  const columnSettingsDialog = () => {
    openDialog({
      name: 'column-settings',
      props: {
        columnSettings: ColumnSettingsContainer[props.parentIdOrPath]?.columns,
        setColumnSettings: setCostumColumnSettings,
      },
      dialogProps: { maxWidth: 'sm', classes: { container: globalClasses.centeredRight } },
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
  const sortableColumns = ['DisplayName', 'Path', 'Type', 'Name', 'Version', 'CreationDate', 'ModificationDate']

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
            disableColumnSettings={props.disableColumnSettings}
            handleColumnSettingsClick={columnSettingsDialog}
            active={activeContent}
            checkboxProps={{ color: 'primary' }}
            cellRenderer={fieldComponentFunc}
            referenceCellRenderer={fieldReferenceFunc}
            displayRowCheckbox={!props.disableSelection}
            fieldsToDisplay={
              (columnSettings?.map((field) => {
                const splittedField = field?.field?.split('/')
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
            /* If the Order by Column Is The Display. The client will sort it. Due to some locale and indexing issues */
            items={
              sortableColumns.includes(String(currentOrder))
                ? children?.sort((a, b) => {
                    // If no display Name
                    const nameA = String(a[currentOrder]) ?? '' // Provide a default value if displayName is undefined
                    const nameB = String(b[currentOrder]) ?? '' // Provide a default value if displayName is undefined

                    if (currentDirection === 'asc') {
                      return nameA.localeCompare(nameB)
                    }
                    return nameB.localeCompare(nameA)
                  })
                : currentOrder === 'CreatedBy' || currentOrder === 'ModifiedBy'
                ? children?.sort((a, b) => {
                    const aTmp = a[currentOrder] as GenericContent
                    const bTmp = b[currentOrder] as GenericContent

                    const nameA = String(aTmp?.DisplayName) ?? ''
                    const nameB = String(bTmp?.DisplayName) ?? ''

                    if (currentDirection === 'asc') {
                      return nameA.localeCompare(nameB)
                    }
                    return nameB.localeCompare(nameA)
                  })
                : children
            }
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
              rowStyle: {
                position: 'relative',
                top: 'unset',
                height: '48px',
                overflow: 'initial',
                padding: '0',
              },
              onRowDoubleClick: onItemDoubleClickFunc,
              disableHeader: props.hideHeader,
              containerStyle: {
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
                paddingBottom: '15px',
                minHeight: '100%',
                height: 'inherit',
                maxHeight: 'inherit',
              },
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
