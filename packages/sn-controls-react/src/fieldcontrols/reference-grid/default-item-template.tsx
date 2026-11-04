/* eslint-disable require-jsdoc */
import {
  Avatar,
  createStyles,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import { InsertDriveFile } from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent, Image, User } from '@sensenet/default-content-types'
import React from 'react'
import { renderIconDefault } from '../icon'

export type PathConfig = {
  appPath: string
  snPath?: string
}

export type Paths = Record<string, PathConfig>

export function getAppPathAndContent(PATHS: Paths, targetPath: string) {
  const matches = Object.entries(PATHS)
    .filter(([, config]) => config.snPath && targetPath.startsWith(config.snPath))
    .sort((a, b) => b[1].snPath!.length - a[1].snPath!.length)

  if (!matches[0]) return undefined

  const [, config] = matches[0]
  const contentePath = targetPath.substring(config.snPath!.length)

  return {
    appPath: config.appPath,
    contentePath,
  }
}

export function buildCustomPath(path: string, action: string | undefined, contentePath: string) {
  const customPath = path
    .replace(':browseType', 'explorer')
    .replace('/:path', '') // Remove the path parameter
    .replace(':action?', action || 'default')

  const url = new URL(window.location.origin)
  url.pathname = customPath
  url.searchParams.set('content', contentePath)

  return url.toString()
}

interface DefaultItemTemplateProps {
  content: GenericContent
  remove?: (id: number) => void
  add: () => void
  actionName?: 'new' | 'edit' | 'browse'
  readOnly?: boolean
  repository?: Repository
  multiple: boolean
  renderIcon?: (name: string) => JSX.Element
  paths?: Paths
}

const useStyles = makeStyles(() =>
  createStyles({
    referenceItemText: {
      textAlign: 'left',
      paddingRight: 15,
      cursor: 'pointer',
      '&[data-clickable="true"]:hover': {
        textDecoration: 'underline',
      },
    },
  }),
)

/**
 * Represents a default renderer for reference grid row
 */
export const DefaultItemTemplate: React.FC<DefaultItemTemplateProps> = (props) => {
  const { content, repository, paths } = props

  const classes = useStyles()

  const renderIcon = (item: GenericContent | User | Image) => {
    if (repository?.schemas.isContentFromType<User>(item, 'User')) {
      const avatarUrl = item.Avatar?.Url
      if (avatarUrl) {
        return (
          <ListItemAvatar>
            {
              <Avatar
                alt={item.FullName}
                src={
                  avatarUrl && repository?.configuration.repositoryUrl
                    ? `${repository.configuration.repositoryUrl}${avatarUrl}`
                    : ''
                }
              />
            }
          </ListItemAvatar>
        )
      }

      return (
        <ListItemAvatar>
          <Avatar alt={item.DisplayName}>
            {item.DisplayName?.split(' ')
              .map((namePart) => namePart[0])
              .join('.')}
          </Avatar>
        </ListItemAvatar>
      )
    }

    if (repository?.schemas.isContentFromType<Image>(item, 'Image') && (!item.PageCount || item.PageCount <= 0)) {
      return (
        <ListItemIcon>
          <img
            data-test="reference-selection-image"
            alt={item.DisplayName}
            src={`${repository?.configuration.repositoryUrl}${item.Path}`}
            style={{ width: '3em', height: '3em', objectFit: 'scale-down' }}
          />
        </ListItemIcon>
      )
    }

    if (repository?.schemas.isContentFromType<Image>(item, 'Image') && item.PageCount && item.PageCount > 0) {
      return (
        <ListItemIcon>
          <img
            data-test="reference-selection-image"
            alt={item.DisplayName}
            src={PathHelper.joinPaths(
              repository?.configuration.repositoryUrl,
              item.Path,
              '/Previews',
              item.Version as string,
              'thumbnail1.png',
            )}
            style={{ width: '3em', height: '3em', objectFit: 'scale-down' }}
          />
        </ListItemIcon>
      )
    }

    return (
      <ListItemIcon style={{ marginRight: 0 }}>
        <Icon>
          <InsertDriveFile />
        </Icon>
      </ListItemIcon>
    )
  }

  return (
    <ListItem style={props.actionName === 'browse' ? { padding: 0 } : undefined} key={content.Id} button={false}>
      {content.Type ? renderIcon(content) : null}
      <ListItemText
        onClick={() => {
          if (content.Id === -1 || !paths) {
            return
          }
          const referencedItemPaths = getAppPathAndContent(paths, content.Path)

          if (!referencedItemPaths) {
            return
          }

          const { appPath, contentePath } = referencedItemPaths

          const fullUrl = buildCustomPath(appPath, props.actionName, contentePath)
          window.location.href = fullUrl
        }}
        primary={content.DisplayName}
        className={classes.referenceItemText}
        data-clickable={content.Id !== -1}
      />
      {props.actionName && props.actionName !== 'browse' && !props.readOnly ? (
        <ListItemSecondaryAction>
          {content.Id > 0 ? (
            <IconButton onClick={() => props.remove?.(content.Id)}>
              {props.renderIcon ? props.renderIcon('remove_circle') : renderIconDefault('remove_circle')}
            </IconButton>
          ) : (
            <IconButton onClick={() => props.add()}>
              {props.renderIcon
                ? props.renderIcon(content.Id === -1 ? 'add_circle' : 'refresh')
                : renderIconDefault(content.Id === -1 ? 'add_circle' : 'refresh')}
            </IconButton>
          )}
        </ListItemSecondaryAction>
      ) : null}
    </ListItem>
  )
}
