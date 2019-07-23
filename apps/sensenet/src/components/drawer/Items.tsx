import DefaultLocalization from '../../localization/default'

export interface DrawerItem {
  name: string
  primaryText: keyof (typeof DefaultLocalization.drawer.titles)
  secondaryText: keyof (typeof DefaultLocalization.drawer.descriptions)
  url: string
  icon: JSX.Element
  requiredGroupPath: string
}

// export const defaultDrawerItems: DrawerItem[] = [
//   {
//     name: 'Search',
//     primaryText: 'Search',
//     secondaryText: 'Search',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Content',
//     primaryText: 'Content',
//     secondaryText: 'Content',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/ContentExplorers',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Users and Groups',
//     primaryText: 'Users and groups',
//     secondaryText: 'Users and groups',
//     url: '/iam',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Operators',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Content Types',
//     primaryText: 'Content Types',
//     secondaryText: 'Content Types',
//     url: '/content-types',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Localization',
//     primaryText: 'Localization',
//     secondaryText: 'Localization',
//     url: '/localization',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Trash',
//     primaryText: 'Trash',
//     secondaryText: 'Trash',
//     url: '/trash',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Setup',
//     primaryText: 'Setup',
//     secondaryText: 'Setup',
//     url: '/setup',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
//     onClick: () => ({}),
//   },
//   {
//     name: 'Version info',
//     primaryText: 'Version info',
//     secondaryText: 'Version info',
//     url: '/info',
//     requiredGroupPath: '/Root/IMS/BuiltIn/Portal/Administrators',
//     onClick: () => ({}),
//   },
// ]

// export const getAllowedDrawerItems = (groups: Group[]) => {
//   return defaultDrawerItems.filter(
//     i => i.requiredGroupPath && (groups.find(g => g.Path === i.requiredGroupPath) ? true : false),
//   )
// }
