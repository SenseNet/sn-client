import { Paper } from '@material-ui/core'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { VirtualDefaultCell, VirtualizedTable } from '@sensenet/list-controls-react'
import {
  CurrentChildrenContext,
  CurrentContentContext,
  LoadSettingsContext,
  useRepository,
} from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types/src'
import { Repository } from '@sensenet/client-core/src'
import { ResponsiveContext } from '../../context'
import { ContentContextMenu } from '../context-menu/content-context-menu'
import { useSelectionService } from '../../hooks'
import { SelectionControl } from '../SelectionControl'
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

const isReferenceField = (fieldName: string, repo: Repository) => {
  const refWhiteList = ['AllowedChildTypes']
  const setting = repo.schemas.getSchemaByName('GenericContent').FieldSettings.find(f => f.Name === fieldName)
  return refWhiteList.indexOf(fieldName) !== -1 || (setting && setting.Type === 'ReferenceFieldSetting') || false
}

export function ReactVirtualizedTable(props: {
  fieldsToDisplay: Array<keyof GenericContent>
  onActivateItem: (item: GenericContent) => void
  onActiveItemChange?: (item: GenericContent) => void
  onParentChange: (newParent: GenericContent) => void
}) {
  const selectionService = useSelectionService()
  const parentContent = useContext(CurrentContentContext)
  const children = useContext(CurrentChildrenContext)
  const device = useContext(ResponsiveContext)
  const loadSettings = useContext(LoadSettingsContext)
  const repo = useRepository()

  const [selected, setSelected] = useState<GenericContent[]>([])
  const [activeContent, setActiveContent] = useState<GenericContent>(children[0])
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
  }, [activeContent, props])

  useEffect(() => {
    setSelected([])
  }, [parentContent.Id])

  useEffect(() => {
    setIsContextMenuOpened(false)
  }, [children, activeContent, selected])

  useEffect(() => {
    selectionService.selection.setValue(selected)
  }, [selected, selectionService.selection])

  useEffect(() => {
    const fields = props.fieldsToDisplay
    loadSettings?.setLoadChildrenSettings({
      ...loadSettings?.loadChildrenSettings,
      expand: ['CheckedOutTo', ...fields.filter(fieldName => isReferenceField(fieldName, repo))],
      orderby: [[currentOrder as any, currentDirection as any]],
    })
  }, [currentDirection, currentOrder, loadSettings, props.fieldsToDisplay, repo])

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
  const menuPropsObj = {
    disablePortal: true,
    anchorReference: 'anchorPosition' as 'anchorPosition',
    anchorPosition: contextMenuAnchor,
    BackdropProps: {
      onClick: () => setIsContextMenuOpened(false),
      onContextMenu: (ev: { preventDefault: () => any }) => ev.preventDefault(),
    },
  }

  const fieldComponentFunc = (fieldOptions: any) => {
    switch (fieldOptions.dataKey) {
      case 'Locked':
        return <LockedField content={fieldOptions.rowData} virtual={true} />
      case 'Icon':
        return <IconField content={fieldOptions.rowData} virtual={true} />
      case 'Email' as any:
        return <EmailField mail={fieldOptions.rowData[fieldOptions.dataKey] as string} virtual={true} />
      case 'Phone' as any:
        return <PhoneField phoneNo={fieldOptions.rowData[fieldOptions.dataKey] as string} virtual={true} />
      case 'DisplayName':
        return (
          <DisplayNameComponent
            content={fieldOptions.rowData}
            device={device}
            isActive={activeContent && fieldOptions.rowData.Id === activeContent.Id}
            virtual={true}
          />
        )
      case 'Description':
        return <DescriptionField text={fieldOptions.rowData[fieldOptions.dataKey] as string} virtual={true} />
      case 'Actions':
        return (
          <ActionsField
            virtual={true}
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
    if (
      fieldOptions.fieldSetting &&
      fieldOptions.fieldSetting.FieldClassName === 'SenseNet.ContentRepository.Fields.DateTimeField'
    ) {
      return <DateField date={fieldOptions.content[fieldOptions.field] as string} virtual={true} />
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
        return <ReferenceField content={expectedContent} virtual={true} />
      }
      return null
    }
    if (typeof fieldOptions.rowData[fieldOptions.dataKey] === 'boolean') {
      return <BooleanField value={fieldOptions.content[fieldOptions.dataKey] as boolean | undefined} virtual={true} />
    }
    return <VirtualDefaultCell cellData={fieldOptions.rowData} />
  }

  const getSelectionControl = (isSelected: any, content: any, onChangeCallback: any) => (
    <SelectionControl {...{ isSelected, content, onChangeCallback }} />
  )
  const onRequestOrderChangeFunc = (field: any, dir: any) => {
    setCurrentOrder(field)
    setCurrentDirection(dir)
  }

  const onItemDoubleClickFunc = (rowMouseEventHandlerParams: { rowData: GenericContent }) =>
    handleActivateItem(rowMouseEventHandlerParams.rowData)

  return (
    <Paper style={{ height: '100%', width: '100%', background: 'transparent', position: 'relative' }}>
      <VirtualizedTable
        active={activeContent}
        cellRenderer={fieldComponentFunc}
        displayRowCheckbox={true}
        fieldsToDisplay={props.fieldsToDisplay}
        getSelectionControl={getSelectionControl}
        items={children}
        onRequestOrderChange={onRequestOrderChangeFunc}
        onRequestSelectionChange={setSelected}
        orderBy={currentOrder}
        orderDirection={currentDirection}
        schema={repo.schemas.getSchema(GenericContent)}
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
          disableHeader: false,
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
  )
}
