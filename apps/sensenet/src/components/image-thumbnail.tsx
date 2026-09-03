import { PhotoOutlined } from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { getImageContentUrl } from '../services'

type ImageThumbnailProps = {
  content: GenericContent
  repository: Repository
  style?: CSSProperties
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ content, repository, style }) => {
  const [source, setSource] = useState<string>()
  const [hasError, setHasError] = useState(false)
  const thumbnailStyle = useMemo<CSSProperties>(
    () => ({
      width: 32,
      height: 32,
      objectFit: 'contain',
      borderRadius: 3,
      display: 'block',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(127, 127, 127, 0.12)',
      border: '1px solid rgba(127, 127, 127, 0.2)',
      ...style,
    }),
    [style],
  )

  useEffect(() => {
    const abortController = new AbortController()
    let objectUrl: string | undefined
    let isCurrentRequest = true

    setSource(undefined)
    setHasError(false)

    const loadThumbnail = async () => {
      try {
        const response = await repository.fetch(getImageContentUrl(repository.configuration.repositoryUrl, content), {
          method: 'GET',
          credentials: 'include',
          cache: 'force-cache',
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(response.statusText)
        }

        objectUrl = URL.createObjectURL(await response.blob())
        if (isCurrentRequest) {
          setSource(objectUrl)
        }
      } catch {
        if (isCurrentRequest && !abortController.signal.aborted) {
          setHasError(true)
        }
      }
    }

    loadThumbnail()

    return () => {
      isCurrentRequest = false
      abortController.abort()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [content, repository])

  if (!source || hasError) {
    return <PhotoOutlined style={thumbnailStyle} aria-hidden="true" />
  }

  return (
    <img
      src={source}
      alt=""
      loading="lazy"
      style={thumbnailStyle}
      onError={() => setHasError(true)}
      data-test="image-thumbnail"
    />
  )
}
