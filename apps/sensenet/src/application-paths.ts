import { BrowseType } from './components/content'

export const PATHS = {
  loginCallback: { appPath: '/authentication/login-callback' },
  silentCallback: { appPath: '/authentication/silent-callback' },
  personalSettings: { appPath: '/personal-settings' },
  events: { appPath: '/events/:eventGuid' },
  savedQueries: { appPath: '/saved-queries' },
  setup: { appPath: '/setup', snPath: '/Root/System/Settings' },
  trash: { appPath: '/trash/:browseType', snPath: '/Root/Trash' },
  localization: { appPath: '/localization/:browseType', snPath: '/Root/Localization' },
  usersAndGroups: { appPath: '/users-and-groups/:browseType', snPath: '/Root/IMS/Public' },
  editBinary: { appPath: '/edit-binary/:contentId' },
  editProperties: { appPath: '/edit-properties/:contentId' },
  browseProperties: { appPath: '/browse-properties/:contentId' },
  newProperties: { appPath: '/new-properties' },
  versionProperties: { appPath: '/version-properties/:contentId' },
  preview: { appPath: '/preview/:contentId' },
  wopi: { appPath: '/wopi/:contentId/:action' },
  dashboard: { appPath: '/dashboard/:dashboardName' },
  contentTypes: { appPath: '/content-types/:browseType', snPath: '/Root/System/Schema/ContentTypes' },
  search: { appPath: '/search' },
  content: { appPath: '/content/:browseType', snPath: '/Root/Content' },
  custom: { appPath: '/custom/:browseType/:path' },
} as const

type RoutesWithContentIdParams = keyof Pick<
  typeof PATHS,
  'editProperties' | 'editBinary' | 'browseProperties' | 'versionProperties' | 'preview'
>

type RoutesWithBrowseTypeParams = keyof Pick<
  typeof PATHS,
  'content' | 'localization' | 'usersAndGroups' | 'contentTypes' | 'trash'
>

type Options =
  | { path: typeof PATHS['events']['appPath']; params?: { eventGuid: string; [index: string]: string } }
  | {
      path: typeof PATHS[RoutesWithBrowseTypeParams]['appPath']
      params?: { browseType: typeof BrowseType[number]; [index: string]: string }
    }
  | {
      path: typeof PATHS['dashboard']['appPath']
      params: { dashboardName: string; [index: string]: string }
    }
  | {
      path: typeof PATHS['wopi']['appPath']
      params: { contentId: string; action: string; [index: string]: string }
    }
  | {
      path: typeof PATHS['custom']['appPath']
      params: { browseType: typeof BrowseType[number]; path: string; [index: string]: string }
    }
  | {
      path: typeof PATHS[RoutesWithContentIdParams]['appPath']
      params: { contentId: number; [index: string]: number }
    }

export const resolvePathParams = ({ path, params }: Options) => {
  let currentPath: string = path
  if (!params) {
    return `/${path.split('/')[1]}`
  }
  Object.keys(params).forEach((key) => {
    currentPath = params[key] ? currentPath.replace(`:${key}`, params[key].toString()) : currentPath
  })
  return currentPath
}
