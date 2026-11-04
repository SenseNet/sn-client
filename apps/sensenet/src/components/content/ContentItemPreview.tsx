import { FolderOutlined, InsertDriveFileOutlined, PhotoOutlined } from '@material-ui/icons'
import { PathHelper } from '@sensenet/client-utils'
import { File, GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { useRepositoryImage } from '../../hooks/use-repository-image'
import { getRepositoryBinaryUrl, isImageContent } from '../../services'
import { Icon } from '../Icon'
import { ImageThumbnail } from '../image-thumbnail'

type Props = { content: GenericContent; size: number; thumbnails: boolean }

/** Keeps icon view independent from the preview resolvers used by the existing grid. */
const ContentTypeIcon = ({ content, style }: { content: GenericContent; style: CSSProperties }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => setHasError(false), [content.Icon, content.Type, content.Path])

  if (isImageContent(content)) return <PhotoOutlined style={style} />
  if (hasError || content.Icon?.toLowerCase() === 'file') {
    return content.IsFolder ? <FolderOutlined style={style} /> : <InsertDriveFileOutlined style={style} />
  }

  return (
    <div style={style} onErrorCapture={() => setHasError(true)}>
      <Icon item={{ ...content, PageCount: 0 }} style={style} />
    </div>
  )
}

const DocumentThumbnail = ({ content, size }: Omit<Props, 'thumbnails'>) => {
  const repository = useRepository()
  const [hasError, setHasError] = useState(false)
  // Only read a previously generated preview; never request preview generation.
  const previewUrl = getRepositoryBinaryUrl(
    repository.configuration.repositoryUrl,
    `/${PathHelper.joinPaths(content.Path, 'Previews', content.Version as string, 'thumbnail1.png')}`,
  )
  const { source, error } = useRepositoryImage(repository, previewUrl, {
    revision: content.ModificationDate?.toString(),
  })
  useEffect(() => setHasError(false), [source])

  const style: CSSProperties = { width: size, height: size, objectFit: 'contain' }
  return source && !error && !hasError ? (
    <img src={source} alt="" style={style} onError={() => setHasError(true)} data-test="document-thumbnail" />
  ) : (
    <ContentTypeIcon content={content} style={style} />
  )
}

export const ContentItemPreview = ({ content, size, thumbnails }: Props) => {
  const repository = useRepository()
  const container = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const image = isImageContent(content)
  const document = Number((content as File).PageCount) > 0 && Boolean(content.Version)

  useEffect(() => {
    if (!thumbnails || visible || (!image && !document)) return
    if (!container.current || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '160px' },
    )
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [document, image, thumbnails, visible])

  const style: CSSProperties = { width: size, height: size, display: 'block' }
  return (
    <div ref={container} style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true">
      {thumbnails && visible && image ? (
        <ImageThumbnail content={content} repository={repository} style={style} />
      ) : thumbnails && visible && document ? (
        <DocumentThumbnail content={content} size={size} />
      ) : (
        <ContentTypeIcon content={content} style={style} />
      )}
    </div>
  )
}
