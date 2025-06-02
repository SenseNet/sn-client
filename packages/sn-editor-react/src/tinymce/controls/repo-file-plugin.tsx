import { createStyles, DialogActions, DialogContent, makeStyles } from '@material-ui/core'
import {
  AddAlert,
  AllInboxOutlined,
  AssignmentOutlined,
  BallotOutlined,
  Block,
  CalendarTodayOutlined,
  CommentOutlined,
  DeleteOutlined,
  Description,
  DescriptionOutlined,
  DomainOutlined,
  Edit,
  EventOutlined,
  FiberNew,
  Folder,
  FolderSpecial,
  GridOnOutlined,
  GroupOutlined,
  HourglassEmpty,
  Info,
  InsertDriveFileOutlined,
  LanguageOutlined,
  LibraryBooksOutlined,
  LinkOutlined,
  ListAltOutlined,
  LocationCity,
  LockOpen,
  MoneyOff,
  PersonOutline,
  PhotoLibrary,
  PhotoOutlined,
  PictureAsPdfOutlined,
  PresentToAllOutlined,
  PublicOutlined,
  Receipt,
  SearchOutlined,
  Settings,
  TextFormat,
  TrendingDown,
  Update,
  VisibilityOff,
  Widgets,
} from '@material-ui/icons'
import { ODataParams, Repository } from '@sensenet/client-core'
import { File } from '@sensenet/default-content-types'
import { Picker } from '@sensenet/pickers-react'
import React, { useEffect, useRef } from 'react'

const useStyles = makeStyles(() => {
  return createStyles({
    dialog: {
      border: 'none !important',
      borderRadius: 12,
      boxShadow: '0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '1.6rem',
      maxWidth: '600px',
      width: '100%',
      '&::backdrop': {
        backgroundColor: 'rgba(255, 255, 255, .75)',
      },

      '& .MuiDialogContent-root': {
        padding: 0,
      },
      '& .MuiDialogTitle-root': {
        paddingLeft: 0,
      },
      '& .tox-icon': {
        position: 'absolute',
        top: '0',
        right: '0',
        marginRight: '25px',
        marginTop: '20px',
        cursor: 'pointer',
        padding: '10px',
      },
    },
  })
})

interface RepoFilePluginControlProps {
  editor: any
  closeDialog: () => void
  repository?: Repository
}

export const RepoFilePluginControl: React.FC<RepoFilePluginControlProps> = ({ editor, closeDialog, repository }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const classes = useStyles()

  const handleInsert = (selection: File[]) => {
    const content = selection
      .filter((item) => item.IsFile)
      .map((item) => {
        const href = `${item.Path.replace(/^\/+/, '')}`.replace('/Content', '')
        const size = item.Size ? `(${(item.Size / 1024).toFixed(0)} KB)` : ''
        return `<div class="download">
          <div>${item.DisplayName}</div>
          <a href="${href}" target="_blank" rel="noopener">Download</a> ${size}
          </div>
          <p>&nbsp;</p>`
      })
      .join('')

    editor.execCommand('mceInsertContent', false, content)
    dialogRef.current?.close()
    closeDialog()
  }
  const queryObject: ODataParams<any> = {
    expand: ['Children'],
    filter: "isOf('GenericContent')",
    metadata: 'no',
    orderby: 'DisplayName',
    select: ['DisplayName', 'Path', 'Id', 'Children/IsFolder', 'IsFolder', 'Avatar', 'Icon', 'Size'],
  }

  useEffect(() => {
    dialogRef.current?.showModal()

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      dialogRef.current?.close()
    }
  }, [])

  const renderIcon = (item: File) => {
    if (!repository || !item.Icon) return <></>
    const html = repository.iconCache.get(item.Icon) ?? ''
    if (html) {
      return <span dangerouslySetInnerHTML={{ __html: html }} className="svgicon" />
    }
    return <>{getIconByName(item.Icon)}</>
  }

  const getIconByName = (name: string | undefined) => {
    switch (name) {
      case 'Folder':
      case 'SystemFolder':
        return <Folder />
      case 'SmartFolder':
        return <FolderSpecial />
      case 'File':
        return <InsertDriveFileOutlined />
      case 'TrashBin':
      case 'DeleteOutlined':
        return <DeleteOutlined />
      case 'PortalRoot':
        return <PublicOutlined />
      case 'Search':
        return <SearchOutlined />
      case 'Comment':
        return <CommentOutlined />
      case 'ImageLibrary':
        return <PhotoLibrary />
      case 'Image':
        return <PhotoOutlined />
      case 'EventList':
        return <CalendarTodayOutlined />
      case 'CalendarEvent':
        return <EventOutlined />
      case 'DocumentLibrary':
      case 'ContentList':
        return <LibraryBooksOutlined />
      case 'excel':
        return <GridOnOutlined />
      case 'word':
        return <DescriptionOutlined />
      case 'powerpoint':
        return <PresentToAllOutlined />
      case 'adobe':
      case 'acrobat':
        return <PictureAsPdfOutlined />
      case 'LinkList':
      case 'MemoList':
      case 'TaskList':
      case 'EventLog':
        return <ListAltOutlined />
      case 'Link':
        return <LinkOutlined />
      case 'Memo':
      case 'Plan':
        return <AssignmentOutlined />
      case 'Task':
        return <BallotOutlined />
      case 'Domain':
        return <DomainOutlined />
      case 'User':
        return <PersonOutline />
      case 'Group':
      case 'Profiles':
        return <GroupOutlined />
      case 'OrganizationalUnit':
        return <LocationCity />
      case 'Resources':
        return <LanguageOutlined />
      case 'Resource':
        return <TextFormat />
      case 'ContentType':
        return <Widgets />
      case 'AddAlert':
        return <AddAlert />
      case 'VisibilityOff':
        return <VisibilityOff />
      case 'MoneyOff':
        return <MoneyOff />
      case 'Update':
        return <Update />
      case 'Receipt':
        return <Receipt />
      case 'HourglassEmpty':
        return <HourglassEmpty />
      case 'FiberNew':
        return <FiberNew />
      case 'TrendingDown':
        return <TrendingDown />
      case 'Block':
        return <Block />
      case 'LockOpen':
        return <LockOpen />
      case 'Box':
      case 'Workspace':
        return <AllInboxOutlined />
      case 'Settings':
        return <Settings />
      case 'Edit':
        return <Edit />
      case 'Details':
        return <Info />
      case 'Description':
        return <Description />
      default:
        return null
    }
  }

  if (!repository) return <></>

  return (
    <dialog ref={dialogRef} className={classes.dialog}>
      <Picker
        repository={repository}
        defaultValue={undefined}
        currentPath={'/Root'}
        selectionRoots={['/Root']}
        itemsODataOptions={queryObject}
        pickerContainer={DialogContent}
        actionsContainer={DialogActions}
        renderIcon={renderIcon}
        required={1}
        allowMultiple={true}
        contextPath={'/Root/Content/Sites/keler'}
        handleSubmit={handleInsert}
        handleCancel={closeDialog}
        localization={{}}
        classes={{}}
      />
    </dialog>
  )
}
