export const applicationPaths = {
  loginCallback: '/authentication/login-callback',
  silentCallback: '/authentication/silent-callback',
  personalSettings: '/personal-settings',
  events: '/events/:eventGuid?',
  savedQueries: '/saved-queries',
  setup: '/setup',
  trash: '/trash',
  localization: '/localization',
  usersAndGroups: '/users-and-groups',
  editBinary: '/edit-binary/:contentId',
  editProperties: '/edit-properties/:contentId',
  browseProperties: '/browse-properties/:contentId',
  newProperties: '/new-properties',
  versionProperties: '/version-properties/:contentId',
  preview: '/preview/:contentId',
  wopi: '/wopi/:contentId/:action',
  dashboard: '/dashboard/:dashboardName',
  contentTypes: '/content-types',
  search: '/search',
  browse: '/browse/:browseType?',
} as const

type RoutesWithContentIdParams = keyof Pick<
  typeof applicationPaths,
  'editProperties' | 'editBinary' | 'browseProperties' | 'versionProperties' | 'preview'
>

type Options =
  | { path: typeof applicationPaths['events']; params?: { eventGuid: string; [index: string]: string } }
  | { path: typeof applicationPaths['browse']; params?: { browseType: string; [index: string]: string } }
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
    currentPath = currentPath.replace(`:${key}`, params[key].toString())
  })
  return currentPath
}
