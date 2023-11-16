import { ODataResponse, Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import { useEffect, useState } from 'react'
import { TReferemceSelectionHelperPath } from './picker-props'

type ReferenceFieldHelperProps = {
  contextPath?: string
  selectionRoots?: string[]
  repository: Repository
}

export const usePickerHelper = ({ contextPath, selectionRoots, repository }: ReferenceFieldHelperProps) => {
  const [helperPaths, setHelperPaths] = useState<TReferemceSelectionHelperPath[]>([])
  const [isAncestorOfRoot, setIsAncestorOfRoot] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getReferencePickerHelperData = async () => {
      const SelectionRootQueries = []

      let isContextPathInTree = false

      for (const root of selectionRoots || []) {
        if (PathHelper.isInSubTree(root, contextPath!)) {
          isContextPathInTree = true
        }

        if (!repository.load) {
          continue
        }

        const promise = repository?.load<GenericContent>({
          idOrPath: root,
          oDataOptions: {
            select: ['Name', 'DisplayName', 'Path'],
          },
        })

        SelectionRootQueries.push(promise)
      }

      try {
        const promiseResult = await Promise.allSettled(SelectionRootQueries)

        const fulfilledResults: TReferemceSelectionHelperPath[] = promiseResult
          .filter((result) => result.status === 'fulfilled' && result.value?.d.Path !== contextPath)
          .map(
            (result) =>
              (result as PromiseFulfilledResult<ODataResponse<GenericContent>>).value
                .d as TReferemceSelectionHelperPath,
          )

        setHelperPaths(fulfilledResults)
        console.log(fulfilledResults)
        setIsLoading(false)
        setIsAncestorOfRoot(isContextPathInTree)
      } catch (e) {
        console.error(e)
      }
    }

    getReferencePickerHelperData()
  }, [selectionRoots, contextPath, repository])

  return { helperPaths, isAncestorOfRoot, isLoading }
}
export default usePickerHelper
