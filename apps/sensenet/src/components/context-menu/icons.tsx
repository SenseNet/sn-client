import React from 'react'
import Search from '@material-ui/icons/Search'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Lock from '@material-ui/icons/Lock'
import LockOpen from '@material-ui/icons/LockOpen'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import Delete from '@material-ui/icons/Delete'
import CloudDownload from '@material-ui/icons/CloudDownload'
import Edit from '@material-ui/icons/Edit'
import UndoIcon from '@material-ui/icons/Undo'
import MuiPublishIcon from '@material-ui/icons/Publish'
import HistoryIcon from '@material-ui/icons/History'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import AppsIcon from '@material-ui/icons/Apps'

export const getIcon = (actionName: string) => {
  switch (actionName) {
    case 'approve':
      return <CheckCircle />
    case 'checkin':
      return <Lock />
    case 'checkout':
      return <LockOpen />
    case 'copyto':
      return <FileCopyOutlinedIcon />
    case 'delete':
      return <Delete />
    case 'download':
      return <CloudDownload />
    case 'edit':
      return <Edit />
    case 'forceundocheckout':
      return <UndoIcon />
    case 'moveto':
      return <FileCopyIcon />
    case 'preview':
      return <Search />
    case 'publish':
      return <MuiPublishIcon />
    case 'setpermissions':
      return <ReportProblemIcon />
    case 'undocheckout':
      return <UndoIcon />
    case 'versions':
      return <HistoryIcon />
    default:
      return <AppsIcon />
  }
}
