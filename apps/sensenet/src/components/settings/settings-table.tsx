import {
  Button,
  createStyles,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
} from '@material-ui/core'

import { Edit, InfoOutlined } from '@material-ui/icons'
import { Settings } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ResponsivePersonalSettings } from '../../context'
import { useLocalization } from '../../hooks'
import { getPrimaryActionUrl } from '../../services'

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
  console.log(settings)
  const classes = useStyles()
  const localization = useLocalization().settings
  const repository = useRepository()
  const uiSettings = useContext(ResponsivePersonalSettings)
  const history = useHistory()
  if (!settings) {
    return <div>Loading</div>
  }
  return (
    <TableContainer>
      <Table>
        <TableHead className={classes.tableHead}>
          <TableRow>
            <TableCell className={classes.tableHeadCell}>{localization.name}</TableCell>
            <TableCell className={classes.tableHeadCell}>{localization.description}</TableCell>
            <TableCell className={classes.tableHeadCell}>{localization.edit}</TableCell>
            <TableCell className={classes.tableHeadCell}>{localization.learnMore}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.Id} className={classes.tableRow}>
              <TableCell component="th" scope="row" className={`${classes.tableCell} ${classes.tableCellName}`}>
                {setting.Name.split('.')[0]
                  .replace(/([A-Z])/g, ' $1')
                  .trim()}
              </TableCell>
              <TableCell className={`${classes.tableCell} ${classes.descriptionCell}`}>
                {setting.Description || '-'}
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Link
                  to={getPrimaryActionUrl({ content: setting, repository, uiSettings, location: history.location })}
                  style={{ textDecoration: 'none' }}>
                  <IconButton
                    aria-label={localization.edit}
                    //data-test={`${dataTestName}-edit-button`}
                  >
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
