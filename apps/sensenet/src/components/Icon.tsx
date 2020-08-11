import { Repository } from '@sensenet/client-core'
import { Injector, LogLevel, PathHelper, tuple } from '@sensenet/client-utils'
import { File, GenericContent, User } from '@sensenet/default-content-types'
import { useInjector, useRepository } from '@sensenet/hooks-react'
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
  ListAlt,
  ListAltOutlined,
  LocationCity,
  LockOpen,
  MoneyOff,
  PersonOutlined,
  PhotoLibrary,
  PhotoOutlined,
  PictureAsPdfOutlined,
  PresentToAllOutlined,
  PublicOutlined,
  Receipt,
  SearchOutlined,
  SettingsOutlined,
  TextFormat,
  TrendingDown,
  Update,
  VisibilityOff,
  Warning,
  WebAssetOutlined,
  Widgets,
} from '@material-ui/icons'
import React from 'react'
import { EventLogEntry } from '../services/EventService'
import { UserAvatar } from './UserAvatar'

export interface IconOptions {
  style?: React.CSSProperties
  injector: Injector
  repo: Repository
}

export interface IconResolver<T> {
  get: (item: T, options: IconOptions) => JSX.Element | null
}

/* eslint-disable react/display-name */

export const defaultContentResolvers: Array<IconResolver<GenericContent>> = [
  {
    get: (item, options) =>
      item.Type && item.Type.includes('User') ? (
        <UserAvatar
          user={item as User}
          style={options.style}
          repositoryUrl={options.repo.configuration.repositoryUrl}
        />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'File' &&
      (item as any).Binary &&
      (item as any).Binary.__mediaresource.content_type === 'application/x-javascript' ? (
        <CodeOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'File' &&
      (item as any).Binary &&
      (item as any).Binary.__mediaresource.content_type === 'text/css' ? (
        <FormatPaintOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      options.repo.schemas.isContentFromType<File>(item, 'File') && item.PageCount && item.PageCount > 0 ? (
        <img
          width={(options.style && options.style.width) || 32}
          height={(options.style && options.style.width) || 32}
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
      item.Type === ('Folder' || 'SystemFolder') || item.Icon === ('Folder' || 'SystemFolder') ? (
        <Folder style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'SmartFolder' || item.Icon === 'SmartFolder' ? <FolderSpecial style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'TrashBin' || item.Icon === 'TrashBin' || item.Icon === 'DeleteOutlined' ? (
        <DeleteOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'PortalRoot' || item.Icon === 'PortalRoot' ? <PublicOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Search' || item.Icon === 'Search' ? <SearchOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Comment' || item.Icon === 'Comment' ? <CommentOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'ImageLibrary' || item.Icon === 'ImageLibrary' ? <PhotoLibrary style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Image' || item.Icon === 'Image' ? <PhotoOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'EventList' || item.Icon === 'EventList' ? <CalendarTodayOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'CalendarEvent' || item.Icon === 'CalendarEvent' ? <EventOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'DocumentLibrary' ||
      item.Icon === 'DocumentLibrary' ||
      item.Type === 'ContentList' ||
      item.Icon === 'ContentList' ? (
        <LibraryBooksOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'TaskList' || item.Icon === 'TaskList' ? <ListAlt style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'File' && item.Icon === 'excel' ? <GridOnOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'File' && item.Icon === 'word' ? <DescriptionOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'File' && item.Icon === 'powerpoint' ? <PresentToAllOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'File' && item.Icon === 'adobe' ? <PictureAsPdfOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === ('LinkList' || 'MemoList' || 'TaskList' || 'EventLog') ||
      item.Icon === ('LinkList' || 'MemoList' || 'TaskList' || 'EventLog') ? (
        <ListAltOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Link' || item.Icon === 'Link' ? <LinkOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Memo' || item.Icon === 'Memo' || item.Type === 'Plan' || item.Icon === 'Plan' ? (
        <AssignmentOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Task' || item.Icon === 'Task' ? <BallotOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Domain' || item.Icon === 'Domain' ? <DomainOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'User' || item.Icon === 'User' ? <PersonOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === ('Group' || 'Profiles' || 'OrganizationalUnit') ||
      item.Icon === ('Group' || 'Profiles' || 'OrganizationalUnit') ? (
        <GroupOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'OrganizationalUnit' || item.Icon === 'OrganizationalUnit' ? (
        <LocationCity style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Resources' || item.Icon === 'Resources' ? <LanguageOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'Resource' || item.Icon === 'Resource' ? <TextFormat style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'ContentType' || item.Icon === 'ContentType' ? <Widgets style={options.style} /> : null,
  },
  {
    get: (item, options) => (item.Icon === 'AddAlert' ? <AddAlert style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'VisibilityOff' ? <VisibilityOff style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'MoneyOff' ? <MoneyOff style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'Update' ? <Update style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'Receipt' ? <Receipt style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'HourglassEmpty' ? <HourglassEmpty style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'FiberNew' ? <FiberNew style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'TrendingDown' ? <TrendingDown style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'Block' ? <Block style={options.style} /> : null),
  },
  {
    get: (item, options) => (item.Icon === 'LockOpen' ? <LockOpen style={options.style} /> : null),
  },
  {
    get: (item, options) =>
      (item.Type && item.Type.indexOf('Workspace') > -1) || item.Icon === 'Box' ? (
        <AllInboxOutlined style={options.style} />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type && item.Type.indexOf('Settings') !== -1 ? <SettingsOutlined style={options.style} /> : null,
  },
  { get: (item, options) => (item.Icon === '' ? <GroupOutlined style={options.style} /> : null) },
]

export const wellKnownIconNames = tuple(
  'AddAlert',
  'Block',
  'Folder',
  'File',
  'ImageLibrary',
  'EventList',
  'FiberNew',
  'CalendarEvent',
  'DeleteOutlined',
  'DocumentLibrary',
  'HourglassEmpty',
  'LinkList',
  'Link',
  'LockOpen',
  'MemoList',
  'Memo',
  'MoneyOff',
  'Receipt',
  'TaskList',
  'Task',
  'TrendingDown',
  'User',
  'Group',
  'ContentType',
  'SystemFolder',
  'Resource',
  'OrganizationalUnit',
  'Update',
  'VisibilityOff',
  'Workspace',
)

export const defaultSchemaResolvers: Array<IconResolver<{ ContentTypeName: typeof wellKnownIconNames[number] }>> = [
  {
    get: (item, options) => {
      switch (item.ContentTypeName) {
        case 'Folder':
          return <Folder style={{ ...options.style }} />
        case 'SmartFolder':
          return <FolderSpecial style={{ ...options.style }} />
        case 'File':
          return <InsertDriveFileOutlined style={{ ...options.style }} />
        case 'ImageLibrary':
          return <PhotoLibrary style={options.style} />
        case 'EventList':
          return <CalendarTodayOutlined style={options.style} />
        case 'CalendarEvent':
          return <EventOutlined style={options.style} />
        case 'DocumentLibrary':
          return <LibraryBooksOutlined style={options.style} />
        case 'LinkList':
          return <ListAltOutlined style={options.style} />
        case 'Link':
          return <LinkOutlined style={options.style} />
        case 'MemoList':
          return <ListAltOutlined style={options.style} />
        case 'Memo':
          return <AssignmentOutlined style={options.style} />
        case 'TaskList':
          return <ListAltOutlined style={options.style} />
        case 'Task':
          return <BallotOutlined style={options.style} />
        case 'User':
          return <PersonOutlined style={options.style} />
        case 'Group':
          return <GroupOutlined style={options.style} />
        case 'ContentType':
          return <Widgets style={options.style} />
        case 'SystemFolder':
          return <Folder style={options.style} />
        case 'Resource':
          return <TextFormat style={options.style} />
        case 'OrganizationalUnit':
          return <GroupOutlined style={options.style} />
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
        case 'DeleteOutlined':
          return <DeleteOutlined style={options.style} />
        case 'Block':
          return <Block style={options.style} />
        case 'LockOpen':
          return <LockOpen style={options.style} />
        default:
          return null
      }
    },
  },
  {
    get: (item, options) =>
      item.ContentTypeName && item.ContentTypeName.indexOf('Workspace') > -1 ? (
        <AllInboxOutlined style={options.style} />
      ) : null,
  },
]

export const editviewFileResolver: Array<IconResolver<GenericContent>> = [
  {
    get: (item, options) => {
      if (item.Type === 'File') {
        return <InsertDriveFileOutlined style={{ ...options.style }} />
      }
      return null
    },
  },
]

export const defaultNotificationResolvers: Array<IconResolver<EventLogEntry<any>>> = [
  {
    get: (item, options) => {
      return item.level === LogLevel.Fatal || item.level === LogLevel.Error ? (
        <ErrorOutlined style={{ ...options.style }} />
      ) : null
    },
  },
  {
    get: (item, options) => {
      return item.level === LogLevel.Warning ? <Warning style={{ ...options.style }} /> : null
    },
  },
  {
    get: (item, options) => {
      return item.level === LogLevel.Debug ? <BugReport style={{ ...options.style }} /> : null
    },
  },
  {
    get: (item, options) => {
      return item.level === LogLevel.Information ? <Info style={{ ...options.style }} /> : null
    },
  },
]

export const IconComponent: React.FunctionComponent<{
  resolvers?: Array<IconResolver<any>>
  item: any
  defaultIcon?: JSX.Element
  style?: React.CSSProperties
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
    return assignedResolver.get(props.item, options) as JSX.Element
  }

  return defaultIcon
}

export { IconComponent as Icon }
