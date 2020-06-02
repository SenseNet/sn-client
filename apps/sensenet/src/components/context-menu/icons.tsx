import AddIcon from '@material-ui/icons/AddCircleOutline'
import AppsIcon from '@material-ui/icons/Apps'
import CheckCircle from '@material-ui/icons/CheckCircle'
import CloudDownload from '@material-ui/icons/CloudDownload'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import HistoryIcon from '@material-ui/icons/History'
import InfoIcon from '@material-ui/icons/Info'
import Lock from '@material-ui/icons/Lock'
import LockOpen from '@material-ui/icons/LockOpen'
import MuiPublishIcon from '@material-ui/icons/Publish'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import RestoreIcon from '@material-ui/icons/RestoreFromTrash'
import Search from '@material-ui/icons/Search'
import ShareIcon from '@material-ui/icons/Share'
import UndoIcon from '@material-ui/icons/Undo'
import React from 'react'

export const getIcon = (actionName: string) => {
  switch (actionName) {
    case 'approve':
      return <CheckCircle />
    case 'browse':
      return <InfoIcon />
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
    case 'share':
      return <ShareIcon />
    case 'add':
      return <AddIcon />
    case 'restore':
      return <RestoreIcon />
    default:
      return <AppsIcon />
  }
}
