import { ODataParams } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'

export interface SimpleTreeProps {
  onItemClick: (item: GenericContent) => void
  parentPath: string
  activeItemPath: string
  loadSettings?: ODataParams<GenericContent>
  onTreeLoadingChange?: (isLoading: boolean) => void
  onNavigate: (item: GenericContent) => void
  rootLoaded: boolean
}
