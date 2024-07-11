import {
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'

import { Delete, Edit, InfoOutlined } from '@material-ui/icons'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'
import { useDialog } from '../dialogs'

const useStyles = makeStyles((theme) => ({
  tableHead: {
    backgroundColor: 'hsl(0deg 0% 24%)',
    cursor: 'default',
  },
  tableHeadCell: {
    color: 'white',
    fontSize: '1.1rem',
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
  tableRow: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
}))

export interface SettingsTableProps {
  settings: Settings[]
}
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

export const SettingsTable = ({ settings }: SettingsTableProps) => {
  const classes = useStyles()
  const localization = useLocalization().settings
  const repository = useRepository()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()
  const { openDialog } = useDialog()
  const updatedSettings = settings.map((setting: Settings) => {
    return {
      ...setting,
      nameToDisplay: setting.Name.split('.')[0]
        .replace(/([A-Z])/g, ' $1')
        .trim(),
      nameToTest: setting.Name.replace(/\.settings/gi, '')
        .replace(/\s+/g, '-')
        .toLowerCase(),
    }
  })
  const hasDeletableSetting = updatedSettings.some((setting) => !isSystemSettings.includes(setting.Name.split('.')[0]))
  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>{localization.name}</TableCell>
            <TableCell className={classes.tableHeadCell}>{localization.description}</TableCell>
            <TableCell className={classes.tableHeadCell}>{localization.edit}</TableCell>
            <TableCell className={classes.tableHeadCell}>{localization.learnMore}</TableCell>
            {hasDeletableSetting && <TableCell className={classes.tableHeadCell}>{localization.delete}</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {updatedSettings.map((setting) => (
            <TableRow key={setting.Id} className={classes.tableRow}>
              <TableCell component="th" scope="row" className={`${classes.tableCell} ${classes.tableCellName}`}>
                {setting.nameToDisplay}
              </TableCell>
              <TableCell className={`${classes.tableCell} ${classes.descriptionCell}`}>
                {setting.Description || '-'}
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Link
                  to={getPrimaryActionUrl({ content: setting, repository, uiSettings, location: history.location })}
                  style={{ textDecoration: 'none' }}>
                  <IconButton aria-label={localization.edit} data-test={`${setting.nameToTest}-edit-button`}>
                    <Edit />
                  </IconButton>
                </Link>
              </TableCell>
              <TableCell className={classes.tableCell}>
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
              {hasDeletableSetting && !isSystemSettings.includes(setting.Name.split('.')[0]) && (
                <TableCell className={classes.tableCell}>
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
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
