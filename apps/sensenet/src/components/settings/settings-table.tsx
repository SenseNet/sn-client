import { IconButton, useTheme } from '@material-ui/core'
import { Delete, Edit, InfoOutlined } from '@material-ui/icons'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import { CellContextMenuEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { useDialog } from '../dialogs'

export const SETUP_DOCS_URL = 'https://docs.sensenet.com/guides/settings/setup'
const hasDocumentation = ['Portal', 'OAuth', 'DocumentPreview', 'OfficeOnline', 'Indexing', 'Sharing']
const isSystemSettings = [
  'DocumentPreview',
  'OAuth',
  'OfficeOnline',
  'Indexing',
  'Sharing',
  'Logging',
  'Portal',
  'Permission',
  'MailProcessor',
  'UserProfile',
  'ColumnSettings',
  'TaskManagement',
  'MultiFactorAuthentication',
]
export const createAnchorFromName = (name: string) => `#${name.toLocaleLowerCase()}`

export interface UpdatedSettings extends Settings {
  nameToDisplay: string
  nameToTest: string
}

export interface SettingsTableProps {
  settings: Settings[]
  onContextMenu: (ev: MouseEvent, setting: Settings) => void
}

export const SettingsTable = ({ settings, onContextMenu }: SettingsTableProps) => {
  const localization = useLocalization().settings
  const repository = useRepository()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()
  const { openDialog } = useDialog()
  const theme = useTheme()

  const updatedSettings: UpdatedSettings[] = settings.map((setting) => ({
    ...setting,
    nameToDisplay: setting.Name.split('.')[0]
      .replace(/([A-Z])/g, ' $1')
      .trim(),
    nameToTest: setting.Name.replace(/\.settings/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase(),
  }))

  const columnDefs = [
    {
      headerName: localization.name,
      field: 'nameToDisplay',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
    },
    {
      headerName: localization.description,
      field: 'Description',
      sortable: true,
      filter: true,
      resizable: true,
      flex: 3,
      cellRenderer: (params: { value: string }) => <span dangerouslySetInnerHTML={{ __html: params.value || '' }} />,
    },
    {
      headerName: localization.edit,
      field: 'edit',
      width: 50,
      cellRenderer: (params: { data: UpdatedSettings }) => (
        <Link to={getPrimaryActionUrl({ content: params.data, repository, uiSettings, location: history.location })}>
          <IconButton style={{ padding: '3px', marginBottom: '6px' }}>
            <Edit style={{ fontSize: '16px' }} />
          </IconButton>
        </Link>
      ),
    },
    {
      headerName: localization.learnMore,
      field: 'learnMore',
      width: 100,
      cellRenderer: (params: { data: UpdatedSettings }) =>
        hasDocumentation.includes(params.data.Name.replace(/\.settings/gi, '')) ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${SETUP_DOCS_URL}${createAnchorFromName(params.data.Name)}`}>
            <IconButton style={{ padding: '3px', marginBottom: '6px' }}>
              <InfoOutlined style={{ fontSize: '16px' }} />
            </IconButton>
          </a>
        ) : null,
    },
    {
      headerName: localization.delete,
      field: 'delete',
      width: 70,
      cellRenderer: (params: { data: UpdatedSettings }) =>
        !isSystemSettings.includes(params.data.Name.split('.')[0]) && (
          <IconButton
            style={{ padding: '3px', marginBottom: '6px' }}
            onClick={() =>
              openDialog({
                name: 'delete',
                props: { content: [params.data] },
                dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
              })
            }>
            <Delete style={{ fontSize: '16px' }} />
          </IconButton>
        ),
    },
  ]

  const onCellContextMenu = (event: CellContextMenuEvent) => {
    event.event?.preventDefault()
    event.event?.stopPropagation()
    if (!event.node || !event.event) return
    const mouseEvent = event.event as MouseEvent
    onContextMenu(mouseEvent, event.data)
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        className={theme.palette.type === 'light' ? 'ag-theme-balham' : 'ag-theme-balham-dark'}
        rowData={updatedSettings}
        columnDefs={columnDefs}
        rowSelection={'multiple'}
        tooltipShowDelay={100}
        preventDefaultOnContextMenu={true}
        suppressContextMenu={true}
        onCellContextMenu={onCellContextMenu}
      />
    </div>
  )
}
