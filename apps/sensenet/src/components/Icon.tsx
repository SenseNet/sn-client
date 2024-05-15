import {
  AddAlert,
  AllInboxOutlined,
  AssignmentOutlined,
  BallotOutlined,
  Block,
  BugReport,
  CalendarTodayOutlined,
  CodeOutlined,
  CommentOutlined,
  DeleteOutlined,
  DescriptionOutlined,
  DomainOutlined,
  Edit,
  ErrorOutlined,
  EventOutlined,
  FiberNew,
  Folder,
  FolderSpecial,
  FormatPaintOutlined,
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
  Warning,
  WebAssetOutlined,
  Widgets,
} from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { Injector, LogLevel, PathHelper } from '@sensenet/client-utils'
import { File, GenericContent, Image, User } from '@sensenet/default-content-types'
import { useInjector, useRepository } from '@sensenet/hooks-react'
import { InlineIcon } from '@iconify/react'
import circleciIcon from '@iconify-icons/logos/circleci'
import gatsbyIcon from '@iconify-icons/logos/gatsby'
import herokuIcon from '@iconify-icons/logos/heroku-icon'
import netlifyIcon from '@iconify-icons/logos/netlify'
import travisCi from '@iconify-icons/logos/travis-ci'
import vercelIcon from '@iconify-icons/logos/vercel-icon'
import React, { CSSProperties, FunctionComponent } from 'react'
import { EventLogEntry } from '../services/EventService'
import { IconFromPath } from './IconFromPath'
import { UserAvatar } from './UserAvatar'

export interface IconOptions {
  style?: CSSProperties
  injector: Injector
  repo: Repository
}

export interface IconResolver<T> {
  get: (item: T, options: IconOptions) => JSX.Element | null
}

const getIconByName = (name: string | undefined, options: IconOptions) => {
  switch (name) {
    case 'Folder':
    case 'SystemFolder':
      return <Folder style={options.style} />
    case 'SmartFolder':
      return <FolderSpecial style={options.style} />
    case 'File':
      return <InsertDriveFileOutlined style={{ ...options.style }} />
    case 'TrashBin':
    case 'DeleteOutlined':
      return <DeleteOutlined style={options.style} />
    case 'PortalRoot':
      return <PublicOutlined style={options.style} />
    case 'Search':
      return <SearchOutlined style={options.style} />
    case 'Comment':
      return <CommentOutlined style={options.style} />
    case 'ImageLibrary':
      return <PhotoLibrary style={options.style} />
    case 'Image':
      return <PhotoOutlined style={options.style} />
    case 'EventList':
      return <CalendarTodayOutlined style={options.style} />
    case 'CalendarEvent':
      return <EventOutlined style={options.style} />
    case 'DocumentLibrary':
    case 'ContentList':
      return <LibraryBooksOutlined style={options.style} />
    case 'excel':
      return <GridOnOutlined style={options.style} />
    case 'word':
      return <DescriptionOutlined style={options.style} />
    case 'powerpoint':
      return <PresentToAllOutlined style={options.style} />
    case 'adobe':
    case 'acrobat':
      return <PictureAsPdfOutlined style={options.style} />
    case 'LinkList':
    case 'MemoList':
    case 'TaskList':
    case 'EventLog':
      return <ListAltOutlined style={options.style} />
    case 'Link':
      return <LinkOutlined style={options.style} />
    case 'Memo':
    case 'Plan':
      return <AssignmentOutlined style={options.style} />
    case 'Task':
      return <BallotOutlined style={options.style} />
    case 'Domain':
      return <DomainOutlined style={options.style} />
    case 'User':
      return <PersonOutline style={options.style} />
    case 'Group':
    case 'Profiles':
      return <GroupOutlined style={options.style} />
    case 'OrganizationalUnit':
      return <LocationCity style={options.style} />
    case 'Resources':
      return <LanguageOutlined style={options.style} />
    case 'Resource':
      return <TextFormat style={options.style} />
    case 'ContentType':
      return <Widgets style={options.style} />
    case 'AddAlert':
      return <AddAlert style={options.style} />
    case 'VisibilityOff':
      return <VisibilityOff style={options.style} />
    case 'MoneyOff':
      return <MoneyOff style={options.style} />
    case 'Update':
      return <Update style={options.style} />
    case 'Receipt':
      return <Receipt style={options.style} />
    case 'HourglassEmpty':
      return <HourglassEmpty style={options.style} />
    case 'FiberNew':
      return <FiberNew style={options.style} />
    case 'TrendingDown':
      return <TrendingDown style={options.style} />
    case 'Block':
      return <Block style={options.style} />
    case 'LockOpen':
      return <LockOpen style={options.style} />
    case 'Box':
    case 'Workspace':
      return <AllInboxOutlined style={options.style} />
    case 'Settings':
      return <Settings style={options.style} />
    case 'Netlify':
      return <InlineIcon icon={netlifyIcon} width="24" />
    case 'Gatsby':
      return <InlineIcon icon={gatsbyIcon} width="24" />
    case 'Travis':
      return <InlineIcon icon={travisCi} width="24" />
    case 'CircleCI':
      return <InlineIcon icon={circleciIcon} width="24" />
    case 'Vercel':
      return <InlineIcon icon={vercelIcon} width="24" />
    case 'Heroku':
      return <InlineIcon icon={herokuIcon} height="24" />
    case 'Edit':
      return <Edit style={options.style} />
    case 'Details':
      return <Info style={options.style} />
    default:
      return null
  }
}

const getIconByPath = (icon: string | undefined, options: IconOptions) => {
  if (!icon || !icon.startsWith('/')) {
    return null
  }

  return <IconFromPath path={icon} options={options} />
}

/* eslint-disable react/display-name */
export const defaultContentResolvers: Array<IconResolver<GenericContent>> = [
  {
    get: (item, options) => getIconByPath(item.Icon, options),
  },
  {
    get: (item, options) =>
      options.repo.schemas.isContentFromType<User>(item, 'User') ? (
        <UserAvatar
          user={item as User}
          style={options.style}
          repositoryUrl={options.repo.configuration.repositoryUrl}
        />
      ) : null,
  },
  {
    get: (item, options) =>
      options.repo.schemas.isContentFromType<File>(item, 'File') &&
      item.Binary?.__mediaresource.content_type === 'application/x-javascript' ? (
        <CodeOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      options.repo.schemas.isContentFromType<File>(item, 'File') &&
      item.Binary?.__mediaresource.content_type === 'text/css' ? (
        <FormatPaintOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      options.repo.schemas.isContentFromType<File>(item, 'File') && item.PageCount && item.PageCount > 0 ? (
        <img
          width={options.style?.width || 32}
          height={options.style?.width || 32}
          alt=""
          src={PathHelper.joinPaths(
            options.repo.configuration.repositoryUrl,
            item.Path,
            '/Previews',
            item.Version as string,
            'thumbnail1.png',
          )}
          style={options.style}
        />
      ) : null,
  },
  {
    get: (item, options) =>
      options.repo.schemas.isContentFromType<Image>(item, 'Image') && (!item.PageCount || item.PageCount <= 0) ? (
        <img
          width={options.style?.width || 32}
          height={options.style?.width || 32}
          alt=""
          src={PathHelper.joinPaths(options.repo.configuration.repositoryUrl, item.Path)}
          style={options.style}
        />
      ) : null,
  },
  {
    get: (item, options) => getIconByName(item.Icon, options),
  },
]

export const defaultSchemaResolvers: Array<IconResolver<GenericContent | { ContentTypeName: string }>> = [
  {
    get: (item, options) => {
      let currentSchema = options.repo.schemas.getSchemaByName(
        'ContentTypeName' in item ? item.ContentTypeName : item.Type,
      )

      do {
        const icon = getIconByName(currentSchema.Icon ?? currentSchema.ContentTypeName, options)
        if (icon) {
          return icon
        }
        currentSchema = options.repo.schemas.getSchemaByName(currentSchema.ParentTypeName || '')
      } while (currentSchema.ContentTypeName && currentSchema.ContentTypeName !== 'GenericContent')

      return null
    },
  },
]

export const defaultNotificationResolvers: Array<IconResolver<EventLogEntry<any>>> = [
  {
    get: (item, options) => {
      switch (item.level) {
        case LogLevel.Fatal:
        case LogLevel.Error:
          return <ErrorOutlined style={{ ...options.style }} />
        case LogLevel.Warning:
          return <Warning style={{ ...options.style }} />
        case LogLevel.Debug:
          return <BugReport style={{ ...options.style }} />
        case LogLevel.Information:
          return <Info style={{ ...options.style }} />
        default:
          return null
      }
    },
  },
]

export const IconComponent: FunctionComponent<{
  resolvers?: Array<IconResolver<any>>
  item: any
  defaultIcon?: JSX.Element
  style?: CSSProperties
}> = (props) => {
  const injector = useInjector()
  const repo = useRepository()

  const options: IconOptions = { style: props.style, injector, repo }
  const resolvers = [
    ...(props.resolvers || []),
    ...defaultContentResolvers,
    ...defaultSchemaResolvers,
    ...defaultNotificationResolvers,
  ]
  const defaultIcon = props.defaultIcon || <WebAssetOutlined style={props.style} /> || null
  const assignedResolver = resolvers.find((r) => (r.get(props.item, options) ? true : false))
  if (assignedResolver) {
    return assignedResolver.get(props.item, options)!
  }
  return defaultIcon
}

export { IconComponent as Icon }
