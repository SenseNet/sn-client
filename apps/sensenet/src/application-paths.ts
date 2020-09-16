import { BrowseType } from './components/content'

export const PATHS = {
  loginCallback: { appPath: '/authentication/login-callback' },
  silentCallback: { appPath: '/authentication/silent-callback' },
  personalSettings: { appPath: '/personal-settings' },
  events: { appPath: '/events/:eventGuid?' },
  savedQueries: { appPath: '/saved-queries/:action?', snPath: '/Root/Content/Queries' },
  setup: { appPath: '/setup/:action?', snPath: '/Root/System/Settings' },
  trash: { appPath: '/trash/:browseType/:action?', snPath: '/Root/Trash' },
  localization: { appPath: '/localization/:browseType/:action?', snPath: '/Root/Localization' },
  usersAndGroups: { appPath: '/users-and-groups/:browseType/:action?', snPath: '/Root/IMS/Public' },
  dashboard: { appPath: '/dashboard' },
  contentTypes: { appPath: '/content-types/:browseType/:action?', snPath: '/Root/System/Schema/ContentTypes' },
  search: { appPath: '/search' },
  content: { appPath: '/content/:browseType/:action?', snPath: '/Root/Content' },
  custom: { appPath: '/custom/:browseType/:path/:action?' },
  root: { appPath: '/custom/explorer/root/' },
} as const

type RoutesWithContentBrowser = keyof Pick<
  typeof PATHS,
  'content' | 'localization' | 'usersAndGroups' | 'contentTypes' | 'trash'
>

type RoutesWithActionParam = keyof Pick<typeof PATHS, 'setup' | 'savedQueries'>

type Options =
  | { path: typeof PATHS['events']['appPath']; params?: { eventGuid: string; [index: string]: string } }
  | {
      path: typeof PATHS[RoutesWithContentBrowser]['appPath']
      params: { browseType: typeof BrowseType[number]; action?: string; [index: string]: string | undefined }
    }
  | {
      path: typeof PATHS['custom']['appPath']
      params: {
        browseType: typeof BrowseType[number]
        path: string
        action?: string
        [index: string]: string | undefined
      }
    }
  | {
      path: typeof PATHS[RoutesWithActionParam]['appPath']
      params?: { action: string; [index: string]: string }
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
