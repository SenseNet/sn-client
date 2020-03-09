import { Avatar } from '@material-ui/core'
import {
  AllInboxOutlined,
  AssignmentOutlined,
  BallotOutlined,
  BugReport,
  CalendarTodayOutlined,
  CodeOutlined,
  CommentOutlined,
  DeleteOutlined,
  DescriptionOutlined,
  DomainOutlined,
  ErrorOutlined,
  EventOutlined,
  Folder,
  FormatPaintOutlined,
  GridOnOutlined,
  GroupOutlined,
  Info,
  InsertDriveFileOutlined,
  LanguageOutlined,
  LibraryBooksOutlined,
  LinkOutlined,
  ListAltOutlined,
  PersonOutlined,
  PhotoLibrary,
  PhotoOutlined,
  PictureAsPdfOutlined,
  PresentToAllOutlined,
  PublicOutlined,
  SearchOutlined,
  SettingsOutlined,
  TextFormat,
  Warning,
  WebAssetOutlined,
  Widgets,
} from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { Injector, LogLevel, PathHelper, tuple } from '@sensenet/client-utils'
import { File, GenericContent, User } from '@sensenet/default-content-types'
import { useInjector, useRepository } from '@sensenet/hooks-react'
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
      item.Type === 'User' ? (
        <UserAvatar
          user={item as User}
          style={options.style}
          repositoryUrl={options.repo.configuration.repositoryUrl}
        />
      ) : null,
  },
  { get: (item, options) => (item.Type === 'Group' ? <GroupOutlined style={options.style} /> : null) },
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
  { get: (item, options) => (item.Type === 'Profiles' ? <GroupOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Folder' ? <Folder style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'SystemFolder' ? <Folder style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'TrashBin' ? <DeleteOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'PortalRoot' ? <PublicOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Search' ? <SearchOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Comment' ? <CommentOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'EventLog' ? <ListAltOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'ImageLibrary' ? <PhotoLibrary style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Image' ? <PhotoOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'EventList' ? <CalendarTodayOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'CalendarEvent' ? <EventOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'DocumentLibrary' ? <LibraryBooksOutlined style={options.style} /> : null) },
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
  { get: (item, options) => (item.Type === 'LinkList' ? <ListAltOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Link' ? <LinkOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'MemoList' ? <ListAltOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Memo' ? <AssignmentOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'TaskList' ? <ListAltOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Task' ? <BallotOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Domain' ? <DomainOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'User' ? <PersonOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Group' ? <GroupOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'SystemFolder' ? <Folder style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Resources' ? <LanguageOutlined style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'Resource' ? <TextFormat style={options.style} /> : null) },
  { get: (item, options) => (item.Type === 'ContentType' ? <Widgets style={options.style} /> : null) },
  {
    get: (item, options) => (item.Type === 'OrganizationalUnit' ? <GroupOutlined style={options.style} /> : null),
  },
  {
    get: (item, options) =>
      item.Type && item.Type.indexOf('Workspace') > -1 ? <AllInboxOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type && item.Type.indexOf('Settings') !== -1 ? <SettingsOutlined style={options.style} /> : null,
  },
  {
    get: (item, options) =>
      item.Type === 'DoomCheatContent' ? (
        <Avatar
          style={{ ...options.style }}
          src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAApVBMVEX///8qHgVoQRt3RSBZPRafXzGETiQzJwmXVi3HdEK1azpQNBK+cD5CKw6fXzHHdELujFi1azrigEutYzb+nGnUfEaXVi3/rXn/pHG+cD72lGB3RSBZPRb/pFZQNBLmhE9oQRvSnBuETiSvWwD/wJvivDPBfAX/tHn/vJJCKw7/tIFMMB0qHgVuUi3//9b/yKf2fHwzJwn/////2Lv/3MeqhGGNUih4YqaaAAAADnRSTlMA07+7w6u3z6+bo8efy6jAuBsAAAMOSURBVHhe3ZfXjuM4EEVHyWHsZVbOcg6de+b/P23rmsbsAE56aO1DH8CGTVFHriJZBf/4lsxm7gnPG/3B8zAym/UTVM2JPO/+kOcYqR4LxmPX9QvczFgYcl4TnKep1l3XNIXvuuPxfcEbTbstIPXb+P7zm65jTOswVKqupeRcn2BERxRFNRuP7z3/saB6uyfouiiyCs6jKE0Zk7I7gxDeiKMzlMBx/tk1DSZCwM5UFWO0gBVedDNwnOsK57jrIwC3BVVVFBAUhdY5wVieVxVekB+PCGG3G05QEXaxoMBWthIQEVZUVUMKigKLCIWU9rPdTFJaDRTDCpDANOVcEvwv7Pc0RWjDCrpO67pWBCTpGcgwVtdaN83/IUgSY+o6DG3qpAzDujYmSSDouqEFnBvz+bnfGwOJIOhmYr///DSG8+EE06mXQ5AT2EZZxjl09j3LsLFwDYLcm04vBTzvL8j5dcHhwFhKaB1F/x0kKFHqtMY1xg6HYQQBTXx6QsRt+/z8/r5ate1iIYjFom1Xq/f35+e2RThPTyQOvl7gUfuMIs4RBG5o2/WaMSwhY+u1HUEAKPfU+ryvF0wiCF5fhQjDNIVGKSHKcrMRQik7EoZCvL5CEE2+XhCwpkHMWZYkWaZUWW63xkBgzHZblkrZK3WNRnNtFQK3v8ANSHCBSyFIiUgR+8tLlgmx2Xx8CJFlLy9laYOTkkJwMX8IAcoJykeSxLEQ2NK/CGxhIeI4SVBiUFJuCdxRP8HIheAaow5NRAikLwzRWCICbSYMkUohtOa8G2HuMAK3UUprY+K4JpA0SSCp+B7HxmitVOMOJ/ALLJMQtpzG8XKZEctlHNvSKgSWufBvC/z5Y8Hcvy3AkbKHCC1+8Rdo9PZQ4RgNKfALlAx1AqGUBGK3Iyg3hX9f4Af3BQEycBcvT1McaltEfhO2uOAgpylK2SOBN78tmHtW0PM3EIZQ6uL5vX7DpQDP74dfoMAjiUsCSUQxR/77CvzJpWCC/PfGOaKxyjNosPZvRn+B43lB8PNMEHieA8H35F+Wcdm7560W+QAAAABJRU5ErkJggg=="
        />
      ) : null,
  },
  {
    get: (item, options) =>
      item.Type === 'WarCheatContent' ? (
        <Avatar
          style={{ ...options.style }}
          src="data:image/png;base64, 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"
        />
      ) : null,
  },
]

export const wellKnownIconNames = tuple(
  'Folder',
  'File',
  'ImageLibrary',
  'EventList',
  'CalendarEvent',
  'DocumentLibrary',
  'LinkList',
  'Link',
  'MemoList',
  'Memo',
  'TaskList',
  'Task',
  'User',
  'Group',
  'ContentType',
  'SystemFolder',
  'Resource',
  'OrganizationalUnit',
  'Workspace',
)

export const defaultSchemaResolvers: Array<IconResolver<{ ContentTypeName: typeof wellKnownIconNames[number] }>> = [
  {
    get: (item, options) => {
      switch (item.ContentTypeName) {
        case 'Folder':
          return <Folder style={{ ...options.style }} />
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
}> = props => {
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
  const assignedResolver = resolvers.find(r => (r.get(props.item, options) ? true : false))
  if (assignedResolver) {
    return assignedResolver.get(props.item, options) as JSX.Element
  }

  return defaultIcon
}
const wrapped = IconComponent

export { wrapped as Icon }
