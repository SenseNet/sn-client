import { BrowseType } from './components/content'

export const PATHS = {
  loginCallback: { appPath: '/authentication/login-callback' },
  silentCallback: { appPath: '/authentication/silent-callback' },
  events: { appPath: '/events/:eventGuid?' },
  savedQueries: { appPath: '/saved-queries/:action?', snPath: '/Root/Content/Queries' },
  trash: { appPath: '/trash/:browseType/:action?', snPath: '/Root/Trash' },
  usersAndGroups: { appPath: '/users-and-groups/:browseType/:action?', snPath: '/Root/IMS' },
  dashboard: { appPath: '/dashboard' },
  contentTypes: { appPath: '/content-types/:browseType/:action?', snPath: '/Root/System/Schema/ContentTypes' },
  search: { appPath: '/search' },
  content: { appPath: '/content/:browseType/:action?', snPath: '/Root/Content' },
  contentTemplates: { appPath: '/content-templates/:browseType/:action?', snPath: '/Root/ContentTemplates' },
  custom: { appPath: '/custom/:browseType/:path/:action?' },
  configuration: { appPath: '/system/settings/:action?', snPath: '/Root/System/Settings' },
  localization: { appPath: '/system/localization/:action?', snPath: '/Root/Localization' },
  webhooks: { appPath: '/system/webhooks/:action?', snPath: '/Root/System/WebHooks' },
  settings: { appPath: '/system/:submenu?' },
  apiKeys: { appPath: '/system/apikeys' },
} as const

type SettingsItemType = 'stats' | 'apikeys' | 'webhooks' | 'adminui'

type RoutesWithContentBrowser = keyof Pick<
  typeof PATHS,
  'content' | 'usersAndGroups' | 'contentTypes' | 'trash' | 'contentTemplates'
>

type RoutesWithActionParam = keyof Pick<typeof PATHS, 'savedQueries' | 'localization' | 'configuration' | 'webhooks'>

type Options =
  | { path: (typeof PATHS)['events']['appPath']; params?: { eventGuid: string;[index: string]: string } }
  | {
    path: (typeof PATHS)[RoutesWithContentBrowser]['appPath']
    params: { browseType: (typeof BrowseType)[number]; action?: string;[index: string]: string | undefined }
  }
  | {
    path: (typeof PATHS)['custom']['appPath']
    params: {
      browseType: (typeof BrowseType)[number]
      path: string
      action?: string
      [index: string]: string | undefined
    }
  }
  | {
    path: (typeof PATHS)[RoutesWithActionParam]['appPath']
    params?: { action: string;[index: string]: string }
  }
  | {
    path: (typeof PATHS)['settings']['appPath']
    params?: { submenu: SettingsItemType;[index: string]: string | SettingsItemType }
  }

export const resolvePathParams = ({ path, params }: Options) => {
  let currentPath: string = path
  params &&
    Object.keys(params).forEach((key) => {
      const paramRegex = new RegExp(`:${key}\\??`)
      currentPath = params[key] ? currentPath.replace(paramRegex, params[key]!.toString()) : currentPath
    })

  currentPath = currentPath.replace(/:[^>:"|?*./\\]+\?/, '') // remove not used optional path params
  return currentPath
}
