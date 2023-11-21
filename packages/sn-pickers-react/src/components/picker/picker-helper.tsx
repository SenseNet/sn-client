import { CircularProgress, Link, Tooltip } from '@material-ui/core'
import { Repository } from '@sensenet/client-core'
import React, { memo } from 'react'
import { usePickerHelper } from './picker-helper.hook'

type ReferenceFieldHelperProps = {
  contextPath?: string
  handleJumpToCurrentPath: (path: string) => void
  styles?: string
  selectionRoots?: string[]
  currentContentText?: string
  repository: Repository
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
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
  const { helperPaths, isAncestorOfRoot, isLoading } = usePickerHelper({
    contextPath,
    selectionRoots,
    repository,
  })

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
      {isAncestorOfRoot && contextPath && (
        <Tooltip title={contextPath}>
          <Link
            data-test="current-content"
            variant="body2"
            onClick={() => handleJumpToCurrentPath(contextPath)}
            className={styles}>
            {currentContentText || 'Current Content'}
          </Link>
        </Tooltip>
      )}

      {helperPaths.length > 0 && (
        <div data-test="path-helpers">
          {helperPaths.map((path) => {
            return (
              <Tooltip key={path.Path} title={path.Path}>
                <Link
                  data-test={`path-helper-${path.Path}`}
                  variant="body2"
                  onClick={() => handleJumpToCurrentPath(path.Path)}
                  className={styles}>
                  {path.DisplayName || path.Name}
                </Link>
              </Tooltip>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default memo(PickerHelper, (prevProps, nextProps) => prevProps.contextPath === nextProps.contextPath)
