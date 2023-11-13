import { CircularProgress, Link } from '@material-ui/core'
import { ODataResponse, Repository } from '@sensenet/client-core'
import { PathHelper } from '@sensenet/client-utils'
import { GenericContent } from '@sensenet/default-content-types'
import React, { useEffect, useState } from 'react'
import { TReferemceSelectionHelperPath } from './picker-props'

type ReferenceFieldHelperProps = {
  contextPath?: string
  handleJumpToCurrentPath: (path: string) => void
  styles?: string
  getPath?: () => Promise<TReferemceSelectionHelperPath[]>
  selectionRoots?: string[]
  currentContentText?: string
  repository: Repository
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  rowGap: '10px',
  paddingTop: '15px',
  width: '240px',
  paddingInline: '10px',
}

export const PickerHelper = ({
  handleJumpToCurrentPath,
  contextPath,
  styles,
  currentContentText,
  selectionRoots,
  repository,
}: ReferenceFieldHelperProps) => {
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

        const promise = repository?.load<GenericContent>({
          idOrPath: root,
          oDataOptions: {
            select: ['Name', 'DisplayName', 'Path'],
          },
        })

        SelectionRootQueries.push(promise)
      }

      const promiseResult = await Promise.allSettled(SelectionRootQueries)

      const fulfilledResults: TReferemceSelectionHelperPath[] = promiseResult
        .filter((result) => result.status === 'fulfilled' && result.value?.d.Path !== contextPath)
        .map(
          (result) =>
            (result as PromiseFulfilledResult<ODataResponse<GenericContent>>).value.d as TReferemceSelectionHelperPath,
        )

      setHelperPaths(fulfilledResults)
      setIsLoading(false)
      setIsAncestorOfRoot(isContextPathInTree)
    }

    getReferencePickerHelperData()
  }, [selectionRoots, contextPath, repository])

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <CircularProgress color="primary" />
      </div>
    )
  }

  if (!isAncestorOfRoot && helperPaths.length === 0) {
    return null
  }

  return (
    <div style={containerStyle}>
      {isAncestorOfRoot && (
        <Link
          data-test="root-content"
          variant="body2"
          onClick={() => handleJumpToCurrentPath(contextPath || '')}
          className={styles}>
          {currentContentText || 'Current Content'}
        </Link>
      )}

      {helperPaths.length > 0 && (
        <div data-test="path-helpers">
          {helperPaths.map((path) => {
            return (
              <Link
                key={path.Path}
                variant="body2"
                onClick={() => handleJumpToCurrentPath(path.Path)}
                className={styles}>
                {path.DisplayName || path.Name}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default PickerHelper
