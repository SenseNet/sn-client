import { Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { ActionModel, ContentType, File, GenericContent, Resource, Settings } from '@sensenet/default-content-types'
import { History, Location } from 'history'
import { match } from 'react-router-dom'
import { PATHS, resolvePathParams } from '../application-paths'
import { CustomContentDrawerItem } from './PersonalSettings'
import { pathWithQueryParams, UiSettings } from '.'

export function getMonacoLanguage(content: GenericContent, repository: Repository) {
  if (repository.schemas.isContentFromType<Settings>(content, 'Settings') || content.Type === 'PersonalSettings') {
    return 'json'
  }
  if (
    repository.schemas.isContentFromType<ContentType>(content, 'ContentType') ||
    repository.schemas.isContentFromType<Resource>(content, 'Resource')
  ) {
    return 'xml'
  }
  if (repository.schemas.isContentFromType<File>(content, 'File')) {
    if (content.Binary) {
      switch (content.Binary.__mediaresource.content_type) {
        case 'application/x-javascript':
          return 'javascript'
        case 'text/css':
          return 'css'
        case 'text/html':
          return 'html'
        case 'text/xml':
          return 'xml'
        case 'application/octet-stream':
          if (content.Name.endsWith('.json')) {
            return 'json'
          } else if (content.Name.endsWith('.ts') || content.Name.endsWith('.tsx')) {
            return 'typescript'
          } else if (content.Name.endsWith('.js') || content.Name.endsWith('.jsx')) {
            return 'javascript'
          } else if (content.Name.endsWith('.md')) {
            return 'markdown'
          }
          break
        default:
          return ''
      }
    }
  }
  return ''
}

export function getPathForContentPath({ path, uiSettings }: { path: string; uiSettings: UiSettings }) {
  const pathOfContent: any = Object.values(PATHS).find((pathConfigElement: any) => {
    return pathConfigElement.snPath ? PathHelper.isInSubTree(path, pathConfigElement.snPath) : false
  })

  if (!pathOfContent) {
    const customDrawerItem = uiSettings.drawer.items
      .filter((item) => item.itemType === 'CustomContent')
      .find((item: CustomContentDrawerItem) => PathHelper.isInSubTree(path, item.settings!.root))
    return { snPath: customDrawerItem?.settings?.root, appPath: customDrawerItem?.settings?.appPath, isCustom: true }
  }

  return { ...pathOfContent, isCustom: false }
}

interface GetUrlForContentParams {
  content: GenericContent
  uiSettings: UiSettings
  location: Location
  action?: string
  snRoute?: any
  removePath?: boolean
}

export function getUrlForContent({
  content,
  uiSettings,
  location,
  action,
  snRoute,
  removePath = false,
}: GetUrlForContentParams) {
  if (snRoute?.path && PathHelper.isInSubTree(content.Path, snRoute.path)) {
    const contentPath = content.Path.replace(snRoute.path, '')
    const searchParams = new URLSearchParams(location.search)
    return pathWithQueryParams({
      path: resolvePathParams({
        path: snRoute.match.path,
        params: {
          ...snRoute.match.params,
          action,
        },
      }),
      newParams: {
        path: action ? (removePath ? undefined : searchParams.get('path')) : contentPath,
        content: action ? contentPath : undefined,
      },
    })
  }

  const pathOfContent = getPathForContentPath({ path: content.Path, uiSettings })

  if (pathOfContent.snPath && pathOfContent.appPath) {
    const contentPath = content.Path.replace(pathOfContent.snPath, '')
    const searchParams = new URLSearchParams(location.search)

    return pathWithQueryParams({
      path: resolvePathParams({
        path: pathOfContent.isCustom ? PATHS.custom.appPath : pathOfContent.appPath,
        params: {
          browseType: uiSettings.content.browseType,
          path: pathOfContent.isCustom ? pathOfContent.appPath : undefined,
          action,
        },
      }),
      newParams: {
        path: action
          ? removePath
            ? undefined
            : snRoute?.match
            ? `/${PathHelper.getParentPath(content.Path)}`.replace(pathOfContent.snPath, '')
            : searchParams.get('path')
          : contentPath,
        content: action ? contentPath : undefined,
      },
    })
  }

  return `${location.pathname}${location.search}`
}

interface NavigateToActionParams {
  history: History
  routeMatch?: match<any>
  action?: string
  queryParams?: any
}

export function navigateToAction({ history, routeMatch, action, queryParams = {} }: NavigateToActionParams) {
  if (!routeMatch) return

  const newPathParams = { ...routeMatch.params, action }
  const searchParams = new URLSearchParams(history.location.search)
  history.push(
    pathWithQueryParams({
      path: resolvePathParams({ path: routeMatch.path as any, params: newPathParams as any }),
      newParams: { path: searchParams.get('path'), ...queryParams },
    }),
  )
}

interface GetPrimaryActionUrlParams {
  content: GenericContent
  repository: Repository
  uiSettings: UiSettings
  location: Location
  snRoute?: any
  removePath?: boolean
}

export function getPrimaryActionUrl({
  content,
  repository,
  uiSettings,
  location,
  snRoute,
  removePath,
}: GetPrimaryActionUrlParams) {
  if (content.Type === 'PersonalSettings') {
    return PATHS.personalSettings.appPath
  }

  if (content.IsFolder) {
    return getUrlForContent({ content, uiSettings, location, snRoute, removePath })
  }

  if (getMonacoLanguage(content, repository)) {
    return getUrlForContent({ content, uiSettings, location, action: 'edit-binary', snRoute, removePath })
  }

  if (
    (content as any).Binary &&
    (content as any).Binary.__mediaresource.content_type !== 'application/x-javascript' &&
    (content as any).Binary.__mediaresource.content_type !== 'text/css' &&
    (content as any).Binary.__mediaresource.content_type !== 'text/xml'
  ) {
    return getUrlForContent({ content, uiSettings, location, action: 'preview', snRoute, removePath })
  }

  if (
    content.Actions &&
    (content.Actions as any[]).length > 0 &&
    (content.Actions as ActionModel[]).find((a) => a.Name === 'WopiOpenEdit')
  ) {
    return getUrlForContent({ content, uiSettings, location, action: 'wopi-edit', snRoute, removePath })
  }

  if (
    content.Actions &&
    (content.Actions as any[]).length > 0 &&
    (content.Actions as ActionModel[]).find((a) => a.Name === 'WopiOpenView')
  ) {
    return getUrlForContent({ content, uiSettings, location, action: 'wopi-view', snRoute, removePath })
  }

  return getUrlForContent({ content, uiSettings, location, action: 'edit', snRoute, removePath })
}
