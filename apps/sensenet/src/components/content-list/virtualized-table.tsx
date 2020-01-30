import { Paper } from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { VirtualDefaultCell, VirtualizedTable } from '@sensenet/list-controls-react'
import { CurrentChildrenContext, LoadSettingsContext, useRepository } from '@sensenet/hooks-react'
import { GenericContent } from '@sensenet/default-content-types/src'
import { Repository } from '@sensenet/client-core/src'
import { ResponsiveContext } from '../../context'
import { ContentContextMenu } from '../context-menu/content-context-menu'
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

export function ReactVirtualizedTable(props: { fieldsToDisplay: Array<keyof GenericContent> }) {
  const children = useContext(CurrentChildrenContext)
  const device = useContext(ResponsiveContext)
  const loadSettings = useContext(LoadSettingsContext)
  const repo = useRepository()

  const [activeContent, setActiveContent] = useState<GenericContent>(children[0])
  const [isContextMenuOpened, setIsContextMenuOpened] = useState(false)
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  })

  useEffect(() => {
    const fields = props.fieldsToDisplay
    loadSettings?.setLoadChildrenSettings({
      ...loadSettings?.loadChildrenSettings,
      expand: ['CheckedOutTo', ...fields.filter(fieldName => isReferenceField(fieldName, repo))],
    })
  }, [loadSettings, props.fieldsToDisplay, repo])

  const onCloseFunc = () => setIsContextMenuOpened(false)
  const onOpenFunc = () => setIsContextMenuOpened(true)

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
    if (
      fieldOptions.fieldSetting &&
      fieldOptions.fieldSetting.FieldClassName === 'SenseNet.ContentRepository.Fields.DateTimeField'
    ) {
      return <DateField date={fieldOptions.content[fieldOptions.field] as string} />
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
      return <BooleanField value={fieldOptions.content[fieldOptions.dataKey] as boolean | undefined} />
    }
    return <VirtualDefaultCell cellData={fieldOptions.rowData} />
  }

  return (
    <Paper style={{ height: '100%', width: '100%', background: 'transparent' }}>
      <VirtualizedTable
        fieldsToDisplay={props.fieldsToDisplay}
        tableProps={{
          width: 1200,
          height: 800,
          rowCount: children.length,
          rowHeight: 48,
          headerHeight: 48,
          rowGetter: ({ index }) => children[index],
          onRowClick: ({ rowData }) => console.log(rowData),
        }}
        cellRenderer={fieldComponentFunc}
      />
      {activeContent ? (
        <ContentContextMenu
          content={activeContent}
          menuProps={menuPropsObj}
          isOpened={isContextMenuOpened}
          onClose={onCloseFunc}
          onOpen={onOpenFunc}
        />
      ) : null}
    </Paper>
  )
}
