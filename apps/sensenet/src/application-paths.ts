import { BrowseType } from './components/content'

export const applicationPaths = {
  loginCallback: '/authentication/login-callback',
  silentCallback: '/authentication/silent-callback',
  personalSettings: '/personal-settings',
  events: '/events/:eventGuid?',
  savedQueries: '/saved-queries',
  setup: '/setup',
  trash: '/trash/:browseType',
  localization: '/localization/:browseType',
  usersAndGroups: '/users-and-groups/:browseType',
  editBinary: '/edit-binary/:contentId',
  editProperties: '/edit-properties/:contentId',
  browseProperties: '/browse-properties/:contentId',
  newProperties: '/new-properties',
  versionProperties: '/version-properties/:contentId',
  preview: '/preview/:contentId',
  wopi: '/wopi/:contentId/:action',
  dashboard: '/dashboard/:dashboardName',
  contentTypes: '/content-types/:browseType',
  search: '/search',
  content: '/content/:browseType',
} as const

type RoutesWithContentIdParams = keyof Pick<
  typeof applicationPaths,
  'editProperties' | 'editBinary' | 'browseProperties' | 'versionProperties' | 'preview'
>

type RoutesWithBrowseTypeParams = keyof Pick<
  typeof applicationPaths,
  'content' | 'localization' | 'usersAndGroups' | 'contentTypes' | 'trash'
>

type Options =
  | { path: typeof applicationPaths['events']; params?: { eventGuid: string; [index: string]: string } }
  | {
      path: typeof applicationPaths[RoutesWithBrowseTypeParams]
      params?: { browseType: typeof BrowseType[number]; [index: string]: string }
    }
  | { path: typeof applicationPaths['dashboard']; params: { dashboardName: string; [index: string]: string } }
  | {
      path: typeof applicationPaths['wopi']
      params: { contentId: string; action: string; [index: string]: string }
    }
  | { path: typeof applicationPaths[RoutesWithContentIdParams]; params: { contentId: number; [index: string]: number } }

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
