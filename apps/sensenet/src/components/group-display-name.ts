import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'

export const getGroupDisplayName = (group: GenericContent) => {
  const displayName = group.DisplayName || group.Name
  const pathSegments = PathHelper.getSegments(group.Path)
  const imsSegmentIndex = pathSegments.findIndex((segment) => segment.toLowerCase() === 'ims')
  const domain = imsSegmentIndex === -1 ? undefined : pathSegments[imsSegmentIndex + 1]

  return domain ? `${domain}\\${displayName}` : displayName
}
