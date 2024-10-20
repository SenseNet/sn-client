import {
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'

import { Delete, Edit, InfoOutlined } from '@material-ui/icons'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { useDialog } from '../dialogs'

const useStyles = makeStyles((theme: Theme) => ({
  tableHead: {
    backgroundColor: theme.palette.type === 'dark' ? 'hsl(0deg 0% 24%)' : 'hsl(0deg 0% 92%)',
    cursor: 'default',
  },
  tableHeadCell: {
    color: theme.palette.type === 'dark' ? 'hsl(0deg 0% 60%)' : '#666666',
    fontSize: '1.1rem',
  },
  stickyTableHeadCell: {
    color: theme.palette.type === 'dark' ? 'hsl(0deg 0% 60%)' : '#666666',
    padding: '0px 1px 0px 0px',
    margin: 0,
    textAlign: 'center',
    maxWidth: '20px',
    minWidth: '20px',
  },
  tableCell: {
    verticalAlign: 'middle',
  },
  tableCellName: {
    fontSize: '1.1rem',
  },
  descriptionCell: {
    textAlign: 'left',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  stickyCell: {
    maxWidth: '32px',
    paddingLeft: '16px',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
}))

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
  onContextMenu: (ev: React.MouseEvent, setting: Settings) => void
}

const stripHtml = (html: string) => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

const sortArray = (array: UpdatedSettings[], order: 'asc' | 'desc', orderBy: keyof UpdatedSettings) => {
  return array.sort((a, b) => {
    const aO = a[orderBy]
    const bO = b[orderBy]
    if (!aO) {
      return order === 'asc' ? -1 : 1
    } else if (!bO) {
      return order === 'asc' ? 1 : -1
    } else if (aO && bO) {
      const aValue = orderBy === 'Description' ? stripHtml(aO.toLocaleString()) : aO.toLocaleString()
      const bValue = orderBy === 'Description' ? stripHtml(bO.toLocaleString()) : bO.toLocaleString()
      if (aValue.toLocaleLowerCase() < bValue.toLocaleLowerCase()) {
        return order === 'asc' ? -1 : 1
      } else if (aValue > bValue) {
        return order === 'asc' ? 1 : -1
      } else {
        return 0
      }
    }
    return 0
  })
}

export const SettingsTable = ({ settings, onContextMenu }: SettingsTableProps) => {
  const classes = useStyles()
  const localization = useLocalization().settings
  const repository = useRepository()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()
  const { openDialog } = useDialog()

  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof UpdatedSettings>('nameToDisplay')

  const handleRequestSort = (property: keyof UpdatedSettings) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const updatedSettings: UpdatedSettings[] = settings.map((setting: Settings) => ({
    ...setting,
    nameToDisplay: setting.Name.split('.')[0]
      .replace(/([A-Z])/g, ' $1')
      .trim(),
    nameToTest: setting.Name.replace(/\.settings/gi, '')
      .replace(/\s+/g, '-')
      .toLowerCase(),
  }))

  const sortedSettings = sortArray(updatedSettings, order, orderBy)
  const hasDeletableSetting = updatedSettings.some((setting) => !isSystemSettings.includes(setting.Name.split('.')[0]))

  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>
              <Tooltip title={localization.name}>
                <TableSortLabel
                  active={orderBy === 'nameToDisplay'}
                  direction={orderBy === 'nameToDisplay' ? order : 'asc'}
                  onClick={() => handleRequestSort('nameToDisplay')}>
                  {localization.name}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.tableHeadCell}>
              <Tooltip title={localization.description}>
                <TableSortLabel
                  active={orderBy === 'Description'}
                  direction={orderBy === 'Description' ? order : 'asc'}
                  onClick={() => handleRequestSort('Description')}>
                  {localization.description}
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell className={classes.stickyTableHeadCell}>{localization.edit}</TableCell>
            <TableCell className={classes.stickyTableHeadCell}>{localization.learnMore}</TableCell>
            {hasDeletableSetting && (
              <TableCell className={classes.stickyTableHeadCell}>{localization.delete}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedSettings.map((setting: UpdatedSettings) => (
            <TableRow
              key={setting.Id}
              className={classes.tableRow}
              onContextMenu={(ev) => {
                ev.preventDefault()
                onContextMenu(ev, setting)
              }}>
              <TableCell component="th" scope="row" className={`${classes.tableCell} ${classes.tableCellName}`}>
                {setting.nameToDisplay}
              </TableCell>
              <TableCell className={`${classes.tableCell} ${classes.descriptionCell}`}>
                <Typography
                  color="textSecondary"
                  style={{ wordWrap: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: setting.Description || '' }}
                />
              </TableCell>
              <TableCell className={classes.stickyCell}>
                <Link
                  to={getPrimaryActionUrl({ content: setting, repository, uiSettings, location: history.location })}
                  style={{ textDecoration: 'none' }}>
                  <IconButton aria-label={localization.edit} data-test={`${setting.nameToTest}-edit-button`}>
                    <Edit />
                  </IconButton>
                </Link>
              </TableCell>
              <TableCell className={classes.stickyCell}>
                {hasDocumentation.includes(
                  (setting.Name || setting.DisplayName || '')?.replace(/\.settings/gi, ''),
                ) && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${SETUP_DOCS_URL}${createAnchorFromName(setting.Name)}`}>
                    <IconButton>
                      <InfoOutlined />
                    </IconButton>
                  </a>
                )}
              </TableCell>
              {hasDeletableSetting && (
                <TableCell className={classes.stickyCell}>
                  {!isSystemSettings.includes(setting.Name.split('.')[0]) && (
                    <IconButton
                      aria-label={localization.delete}
                      data-test={`${setting.nameToTest}-delete-button`}
                      onClick={() => {
                        openDialog({
                          name: 'delete',
                          props: { content: [setting] },
                          dialogProps: { disableBackdropClick: true, disableEscapeKeyDown: true },
                        })
                      }}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
