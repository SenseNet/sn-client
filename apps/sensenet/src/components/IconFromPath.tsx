import { WebAssetOutlined } from '@material-ui/icons'
import { PathHelper } from '@sensenet/client-utils'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { IconOptions } from './Icon'

// Global cache for icons
const iconCache = new Map<string, string | null>()
const iconRequestCache = new Map<string, Promise<string | null>>()

const loadIcon = (path: string, repo: IconOptions['repo']) => {
  const imageUrl = PathHelper.joinPaths(repo.configuration.repositoryUrl, path)
  if (iconCache.has(imageUrl)) {
    return Promise.resolve(iconCache.get(imageUrl)!)
  }

  const pendingRequest = iconRequestCache.get(imageUrl)

  if (pendingRequest) {
    return pendingRequest
  }

  const request = (async () => {
    if (!path.toLowerCase().endsWith('.svg')) {
      iconCache.set(imageUrl, imageUrl)
      return imageUrl
    }

    try {
      const response = await repo.fetch(imageUrl, { cache: 'force-cache' })

      if (!response.ok) {
        iconCache.set(imageUrl, null)
        return null
      }

      const svg = await response.text()
      if (!/<svg(?:\s|>)/i.test(svg)) {
        iconCache.set(imageUrl, null)
        return null
      }
      const resizedSvg = svg.replace('width=', 'width="24px" oldwidth=').replace('height=', 'height="24px" oldheight=')

      iconCache.set(imageUrl, resizedSvg)
      return resizedSvg
    } catch {
      iconCache.set(imageUrl, null)
      return null
    }
  })()

  iconRequestCache.set(imageUrl, request)
  request.finally(() => iconRequestCache.delete(imageUrl))

  return request
}

export const IconImage = ({
  src,
  fallback,
  ...imageProps
}: React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: JSX.Element }) => {
  const [failedSource, setFailedSource] = useState<string>()
  if (!src || failedSource === src) {
    return fallback || <WebAssetOutlined style={imageProps.style} aria-hidden="true" />
  }
  return <img {...imageProps} src={src} alt="" aria-hidden="true" onError={() => setFailedSource(src)} />
}

const IconFromPath = ({ path, options, fallback }: { path: string; options: IconOptions; fallback?: JSX.Element }) => {
  const { repo, style } = options
  const imageUrl = PathHelper.joinPaths(repo.configuration.repositoryUrl, path)
  const [result, setResult] = useState<{ imageUrl: string; icon: string | null }>(() => ({
    imageUrl,
    icon: iconCache.get(imageUrl) || null,
  }))
  const icon = result.imageUrl === imageUrl ? result.icon : null

  useEffect(() => {
    let isMounted = true

    if (iconCache.has(imageUrl)) {
      setResult({ imageUrl, icon: iconCache.get(imageUrl) || null })
      return
    }

    setResult({ imageUrl, icon: null })
    loadIcon(path, repo).then((loadedIcon) => {
      if (isMounted) {
        setResult({ imageUrl, icon: loadedIcon })
      }
    })

    return () => {
      isMounted = false
    }
  }, [path, repo, imageUrl])

  // Memoize the rendered output to prevent unnecessary DOM updates
  const renderedIcon = useMemo(() => {
    if (!icon) return fallback || options.defaultIcon || <WebAssetOutlined style={style} aria-hidden="true" />

    return path.toLowerCase().endsWith('.svg') ? (
      <span dangerouslySetInnerHTML={{ __html: icon }} style={style} aria-hidden="true" />
    ) : (
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        style={style}
        onError={() => {
          iconCache.set(imageUrl, null)
          setResult((current) => (current.imageUrl === imageUrl ? { imageUrl, icon: null } : current))
        }}
      />
    )
  }, [icon, path, style, imageUrl, fallback, options.defaultIcon])

  return renderedIcon
}

// Memoize the component to prevent re-renders if props are unchanged
export const MemoizedIconFromPath = memo(IconFromPath, (prevProps, nextProps) => {
  return (
    prevProps.path === nextProps.path &&
    prevProps.options.repo === nextProps.options.repo &&
    prevProps.options.style === nextProps.options.style &&
    prevProps.options.defaultIcon === nextProps.options.defaultIcon &&
    prevProps.fallback === nextProps.fallback
  )
})

export { IconFromPath }
