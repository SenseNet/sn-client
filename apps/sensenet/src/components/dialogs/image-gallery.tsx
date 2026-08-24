import {
  Button,
  CircularProgress,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import BrokenImageOutlinedIcon from '@material-ui/icons/BrokenImageOutlined'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CloseIcon from '@material-ui/icons/Close'
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined'
import RefreshIcon from '@material-ui/icons/Refresh'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalization } from '../../hooks'
import { getImageContentUrl } from '../../services'
import { useDialog } from './dialog-provider'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: '#fff',
      backgroundColor: '#111315',
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    header: {
      minHeight: 64,
      padding: theme.spacing(1, 1, 1, 3),
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(2),
      backgroundColor: '#1b1d21',
      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
      boxSizing: 'border-box',
    },
    headerText: {
      minWidth: 0,
      flexGrow: 1,
    },
    fileName: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontWeight: 600,
    },
    counter: {
      color: 'rgba(255, 255, 255, 0.64)',
      whiteSpace: 'nowrap',
    },
    canvas: {
      position: 'relative',
      minHeight: 0,
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: theme.spacing(3, 8),
      backgroundImage:
        'linear-gradient(45deg, rgba(255,255,255,.035) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,.035) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,.035) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,.035) 75%)',
      backgroundSize: '24px 24px',
      backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2, 6),
      },
    },
    image: {
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      boxShadow: '0 18px 48px rgba(0, 0, 0, 0.38)',
    },
    loader: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(2),
      color: 'rgba(255, 255, 255, 0.72)',
      backgroundColor: '#111315',
      zIndex: 1,
    },
    error: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: 480,
      gap: theme.spacing(1.5),
      color: 'rgba(255, 255, 255, 0.72)',
      textAlign: 'center',
    },
    errorIcon: {
      fontSize: 52,
      color: theme.palette.error.light,
    },
    navigationButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
      },
      '&.Mui-disabled': {
        color: 'rgba(255, 255, 255, 0.22)',
      },
    },
    previous: {
      left: theme.spacing(1.5),
    },
    next: {
      right: theme.spacing(1.5),
    },
    footer: {
      backgroundColor: '#1b1d21',
      borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    },
    rail: {
      minHeight: 58,
      padding: theme.spacing(1),
      display: 'flex',
      gap: theme.spacing(1),
      overflowX: 'auto',
      boxSizing: 'border-box',
    },
    railItem: {
      minWidth: 150,
      maxWidth: 220,
      height: 40,
      padding: theme.spacing(0.5, 1.25),
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: 'rgba(255, 255, 255, 0.68)',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid transparent',
      borderRadius: 4,
      cursor: 'pointer',
      font: 'inherit',
      textAlign: 'left',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.1)',
      },
    },
    activeRailItem: {
      color: '#fff',
      borderColor: theme.palette.primary.main,
      background: 'rgba(1, 146, 219, 0.18)',
    },
    railItemName: {
      minWidth: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
)

export type ImageGalleryDialogProps = {
  contents: GenericContent[]
  initialContentId?: number
}

const getInitialIndex = (contents: GenericContent[], initialContentId?: number) => {
  const index = contents.findIndex((content) => content.Id === initialContentId)
  return index >= 0 ? index : 0
}

const ImageGalleryDialog: React.FC<ImageGalleryDialogProps> = ({ contents, initialContentId }) => {
  const classes = useStyles()
  const localization = useLocalization().imageGallery
  const repository = useRepository()
  const { closeLastDialog } = useDialog()
  const [currentIndex, setCurrentIndex] = useState(() => getInitialIndex(contents, initialContentId))
  const [imageSource, setImageSource] = useState<string>()
  const [loadError, setLoadError] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [retryToken, setRetryToken] = useState(0)
  const currentContent = contents[currentIndex]

  const showPrevious = useCallback(() => {
    setCurrentIndex((index) => (index > 0 ? index - 1 : contents.length - 1))
  }, [contents.length])

  const showNext = useCallback(() => {
    setCurrentIndex((index) => (index < contents.length - 1 ? index + 1 : 0))
  }, [contents.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && contents.length > 1) {
        event.preventDefault()
        showPrevious()
      }
      if (event.key === 'ArrowRight' && contents.length > 1) {
        event.preventDefault()
        showNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [contents.length, showNext, showPrevious])

  useEffect(() => {
    const abortController = new AbortController()
    let objectUrl: string | undefined
    let isCurrentRequest = true

    setImageSource(undefined)
    setLoadError(undefined)
    setIsLoading(true)

    const loadImage = async () => {
      try {
        const response = await repository.fetch(
          getImageContentUrl(repository.configuration.repositoryUrl, currentContent),
          {
            method: 'GET',
            credentials: 'include',
            signal: abortController.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`.trim())
        }

        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        if (isCurrentRequest) {
          setImageSource(objectUrl)
        }
      } catch (error) {
        if (isCurrentRequest && !abortController.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : String(error))
          setIsLoading(false)
        }
      }
    }

    loadImage()

    return () => {
      isCurrentRequest = false
      abortController.abort()
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [currentContent, repository, retryToken])

  const displayName = currentContent.DisplayName || currentContent.Name
  const counterText = useMemo(
    () => localization.imageCount(currentIndex + 1, contents.length),
    [contents.length, currentIndex, localization],
  )

  return (
    <div className={classes.root} data-test="image-gallery-dialog">
      <div className={classes.header}>
        <div className={classes.headerText}>
          <Typography className={classes.fileName}>{displayName}</Typography>
          <Typography variant="caption" className={classes.counter}>
            {counterText}
          </Typography>
        </div>
        {imageSource ? (
          <Tooltip title={localization.download}>
            <IconButton
              component="a"
              href={imageSource}
              download={currentContent.Name}
              aria-label={localization.download}
              style={{ color: '#fff' }}>
              <CloudDownloadOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        <Tooltip title={localization.close}>
          <IconButton aria-label={localization.close} onClick={closeLastDialog} style={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </div>

      <div className={classes.canvas}>
        {contents.length > 1 ? (
          <>
            <Tooltip title={localization.previousImage}>
              <IconButton
                className={`${classes.navigationButton} ${classes.previous}`}
                onClick={showPrevious}
                aria-label={localization.previousImage}>
                <ChevronLeftIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            <Tooltip title={localization.nextImage}>
              <IconButton
                className={`${classes.navigationButton} ${classes.next}`}
                onClick={showNext}
                aria-label={localization.nextImage}>
                <ChevronRightIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </>
        ) : null}

        {loadError ? (
          <div className={classes.error} role="alert">
            <BrokenImageOutlinedIcon className={classes.errorIcon} />
            <Typography variant="h6">{localization.loadFailed}</Typography>
            <Typography variant="body2">{loadError}</Typography>
            <Button
              color="primary"
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => setRetryToken((value) => value + 1)}>
              {localization.retry}
            </Button>
          </div>
        ) : null}

        {imageSource ? (
          <img
            className={classes.image}
            src={imageSource}
            alt={displayName}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setLoadError(localization.unsupportedImage)
              setIsLoading(false)
            }}
          />
        ) : null}

        {isLoading && !loadError ? (
          <div className={classes.loader} aria-live="polite">
            <CircularProgress color="primary" />
            <Typography variant="body2">{localization.loading}</Typography>
          </div>
        ) : null}
      </div>

      {contents.length > 1 ? (
        <div className={classes.footer}>
          <div className={classes.rail} aria-label={localization.galleryItems}>
            {contents.map((content, index) => (
              <button
                type="button"
                key={content.Id}
                className={`${classes.railItem} ${index === currentIndex ? classes.activeRailItem : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-current={index === currentIndex ? 'true' : undefined}
                title={content.DisplayName || content.Name}>
                <ImageOutlinedIcon fontSize="small" />
                <span className={classes.railItemName}>{content.DisplayName || content.Name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ImageGalleryDialog
