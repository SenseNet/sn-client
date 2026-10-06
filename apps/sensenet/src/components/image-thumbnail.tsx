import { PhotoOutlined } from '@material-ui/icons'
import { Repository } from '@sensenet/client-core'
import { GenericContent } from '@sensenet/default-content-types'
import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import { useRepositoryImage } from '../hooks/use-repository-image'
import { getImageContentUrl } from '../services/image-content-service'

type ImageThumbnailProps = {
  content: GenericContent
  repository: Repository
  style?: CSSProperties
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ content, repository, style }) => {
  const [hasError, setHasError] = useState(false)
  const imageUrl = getImageContentUrl(repository.configuration.repositoryUrl, content)
  const { source, error } = useRepositoryImage(repository, imageUrl, { revision: content.ModificationDate?.toString() })
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

  useEffect(() => setHasError(false), [source])

  if (!source || error || hasError) {
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
