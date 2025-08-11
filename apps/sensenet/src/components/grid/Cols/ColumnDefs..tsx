import { IconButton } from '@material-ui/core'
import { Edit, InfoOutlined } from '@material-ui/icons'
import { ColDef } from 'ag-grid-community'
import React from 'react'
import { ReferenceField, RolesField } from '../../content-list'
import { createAnchorFromName, SETUP_DOCS_URL, UpdatedSettings } from '../../settings/settings-table'
import { ActionFormatter } from '../Formatters/ActionFormatter'
import { DateTimeFormatter } from '../Formatters/DateTimeFormatter'
import { IconFormatter } from '../Formatters/IconFormatter'
import { UserNameFormatter } from '../Formatters/UserNameFormatter'

const enabledColDef: ColDef = {
  headerName: 'Enabled',
  field: 'Enabled',
  headerTooltip: 'Enabled',
  tooltipField: 'Enabled',
  width: 70,
  maxWidth: 70,
  minWidth: 70,
}

const lockedColDef: ColDef = {
  headerName: 'Locked',
  field: 'Locked',
  headerTooltip: 'Locked',
  tooltipField: 'Locked',
  width: 70,
  maxWidth: 70,
  minWidth: 70,
}

const checkBoxCol: ColDef = {
  headerCheckboxSelection: true,
  checkboxSelection: true,
  headerCheckboxSelectionFilteredOnly: true,
  width: 27,
  minWidth: 27,
  cellStyle: { padding: '0px 4px' },
  headerClass: 'grid-checkbox-header',
}
const iconCol: ColDef = {
  headerName: '',
  field: 'Icon',
  width: 24,
  minWidth: 24,
  cellRenderer: IconFormatter,
  cellStyle: { padding: 0 },
}
const idCol: ColDef = {
  headerName: 'ID',
  field: 'Id',
  headerTooltip: 'ID',
  tooltipField: 'Id',
  flex: 0.75,
  filter: true,
  sortable: true,
  resizable: true,
  cellStyle: { paddingRight: 0 },
}

function GetDate(date: any) {
  if (date === undefined) {
    return ''
  }
  return date.replace('T', ' ').replace('Z', '').split('.', 1)[0]
}

export const contentColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  idCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'Name',
    field: 'Name',
    headerTooltip: 'Name',
    tooltipField: 'Name',
    flex: 1.5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'Index',
    field: 'Index',
    headerTooltip: 'Index',
    tooltipField: 'Index',
    flex: 0.75,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Created By',
    field: 'CreatedBy',
    headerTooltip: 'Created By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Creation Date',
    field: 'CreationDate',
    headerTooltip: 'Creation Date',
    cellRenderer: DateTimeFormatter,
    tooltipValueGetter: (params) => GetDate(params.value),
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modified By',
    field: 'ModifiedBy',
    headerTooltip: 'Modified By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modification Date',
    field: 'ModificationDate',
    headerTooltip: 'Modification Date',
    cellRenderer: DateTimeFormatter,
    tooltipValueGetter: (params) => GetDate(params.value),
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

export const userColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'E-mail',
    field: 'Email',
    headerTooltip: 'E-mail',
    tooltipField: 'Email',
  },
  {
    headerName: 'Roles',
    field: 'AllRoles',
    headerTooltip: 'Roles',
    width: 110,
    minWidth: 110,
    maxWidth: 110,
    cellRendererFramework: (params: any) => {
      const roles = params.data.AllRoles.length ? params.data.AllRoles : []
      const directRoles = params.data.DirectRoles?.length ? params.data.DirectRoles : []
      return <RolesField user={params.data} roles={roles} directRoles={directRoles} />
    },
  },
  enabledColDef,
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

export const groupColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Description',
    field: 'Description',
    headerTooltip: 'Description',
    tooltipField: 'Description',
    resizable: true,
  },
  {
    headerName: 'Members',
    field: 'Members',
    headerTooltip: 'Members',
    sortable: true,
    width: 110,
    minWidth: 110,
    maxWidth: 110,
    cellRendererFramework: (params: any) => {
      return <ReferenceField content={params.data} fieldName={'Members'} parent={params.data} showIcon={true} />
    },
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
  },
]

export const savedQueriesColumnDefs: ColDef[] = [
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    sortable: true,
    resizable: true,
  },
  lockedColDef,
  {
    headerName: 'Created By',
    field: 'CreatedBy',
    headerTooltip: 'Created By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
  },
]

export const trashColumnDefs: ColDef[] = [
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Deleted From',
    field: 'OriginalPath',
    headerTooltip: 'Deleted From',
    tooltipField: 'OriginalPath',
    flex: 2,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Deleted By',
    field: 'CreatedBy',
    headerTooltip: 'Deleted By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Deleted When',
    field: 'CreationDate',
    headerTooltip: 'Deleted When',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
  },
]

export const contentExplorerColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Name',
    field: 'Name',
    headerTooltip: 'Name',
    tooltipField: 'Name',
    flex: 1.5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  lockedColDef,
  {
    headerName: 'Created By',
    field: 'CreatedBy',
    headerTooltip: 'Created By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Creation Date',
    field: 'CreationDate',
    headerTooltip: 'Creation Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modified By',
    field: 'ModifiedBy',
    headerTooltip: 'Modified By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modification Date',
    field: 'ModificationDate',
    headerTooltip: 'Modification Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

export const contentTypesColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'Name',
    field: 'Name',
    headerTooltip: 'Name',
    tooltipField: 'Name',
    flex: 1.5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'Description',
    field: 'Description',
    headerTooltip: 'Description',
    tooltipField: 'Description',
    resizable: true,
  },
  {
    headerName: 'ParentTypeName',
    field: 'ParentTypeName',
    headerTooltip: 'ParentTypeName',
    tooltipField: 'ParentTypeName',
    resizable: true,
  },
  {
    headerName: 'Modified By',
    field: 'ModifiedBy',
    headerTooltip: 'Modified By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modification Date',
    field: 'ModificationDate',
    headerTooltip: 'Modification Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

export const contentTemplatesColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  lockedColDef,

  {
    headerName: 'Created By',
    field: 'CreatedBy',
    headerTooltip: 'Created By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Creation Date',
    field: 'CreationDate',
    headerTooltip: 'Creation Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modified By',
    field: 'ModifiedBy',
    headerTooltip: 'Modified By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modification Date',
    field: 'ModificationDate',
    headerTooltip: 'Modification Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

export const localizationColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  lockedColDef,

  {
    headerName: 'Created By',
    field: 'CreatedBy',
    headerTooltip: 'Created By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Creation Date',
    field: 'CreationDate',
    headerTooltip: 'Creation Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modified By',
    field: 'ModifiedBy',
    headerTooltip: 'Modified By',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modification Date',
    field: 'ModificationDate',
    headerTooltip: 'Modification Date',
    tooltipValueGetter: (params) => GetDate(params.value),
    cellRenderer: DateTimeFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    tooltipField: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

export const webHooksColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'WebHookUrl',
    field: 'WebHookUrl',
    headerTooltip: 'WebHookUrl',
    tooltipField: 'WebHookUrl',
    resizable: true,
  },
  enabledColDef,
  {
    headerName: 'SuccessfulCalls',
    field: 'SuccessfulCalls',
    headerTooltip: 'SuccessfulCalls',
    tooltipField: 'SuccessfulCalls',
    width: 110,
    maxWidth: 110,
    minWidth: 110,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]

const hasDocumentation = ['Portal', 'OAuth', 'DocumentPreview', 'OfficeOnline', 'Indexing', 'Sharing']

export const getSettingsColumnDefs = (history: any): ColDef[] => [
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    sortable: true,
    resizable: true,
    flex: 1,
  },
  {
    headerName: 'Description',
    field: 'Description',
    headerTooltip: 'Description',
    tooltipField: 'Description',
    resizable: true,
    flex: 4,
  },
  {
    headerName: 'Edit',
    resizable: false,
    width: 50,
    cellRenderer: (params: any) => {
      const content = encodeURIComponent(params.data?.Name || '')
      return (
        <IconButton
          style={{ padding: '3px', marginBottom: '6px' }}
          onClick={() => {
            history.push(`/system/settings/edit-binary?path=&content=%2F${content}`)
          }}>
          <Edit style={{ fontSize: '16px' }} />
        </IconButton>
      )
    },
  },
  {
    headerName: 'Learn More',
    resizable: false,
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
    width: 90,
  },
]

export const searchColumnDefs: ColDef[] = [
  checkBoxCol,
  iconCol,
  {
    headerName: 'Display Name',
    field: 'DisplayName',
    headerTooltip: 'Display Name',
    tooltipField: 'DisplayName',
    flex: 5,
    filter: true,
    sortable: true,
    comparator: (valueA: string, valueB: string) => {
      return valueA.toLowerCase().localeCompare(valueB.toLowerCase())
    },
    resizable: true,
  },
  {
    headerName: 'Path',
    field: 'Path',
    headerTooltip: 'Path',
    tooltipField: 'Path',
    flex: 5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Modified By',
    field: 'ModifiedBy',
    headerTooltip: 'Modified By',
    tooltipField: 'ModifiedBy',
    cellRenderer: UserNameFormatter,
    flex: 1.5,
    filter: true,
    sortable: true,
    resizable: true,
  },
  {
    headerName: 'Actions',
    field: 'Actions',
    headerTooltip: 'Actions',
    cellRenderer: ActionFormatter,
    width: 70,
    resizable: false,
    wrapText: true,
    autoHeight: true,
  },
]
