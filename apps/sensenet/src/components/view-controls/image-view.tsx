/**
 * @module ViewControls
 */
import { Button, CircularProgress, createStyles, makeStyles, Typography } from '@material-ui/core'
import { GenericContent } from '@sensenet/default-content-types'
import { useRepository } from '@sensenet/hooks-react'
import React, { ReactElement, useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { useGlobalStyles } from '../../globalStyles'
import { useLocalization } from '../../hooks'
import { useRepositoryImage } from '../../hooks/use-repository-image'
import { getImageContentUrl, navigateToAction } from '../../services'

const useStyles = makeStyles(() => {
  return createStyles({
    imageViewContainer: {
      width: 'auto',
      overflow: 'auto',
      margin: '0 24px',
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '30px',
      marginBottom: '20px',
      alignItems: 'center',
    },
    title: {
      fontSize: '20px',
      paddingRight: '10px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    contentName: {
      fontWeight: 500,
    },
    imageContainer: {
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'flex-start',
    },
    image: {
      maxWidth: '100%',
    },
    buttonWrapper: {
      padding: '20px 0',
      width: '90%',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      alignItems: 'flex-end',
    },
  })
})

export interface ImageViewProps {
  renderIcon?: (name: string) => ReactElement
  handleCancel?: () => void
  contentPath: string
}

export const ImageView: React.FC<ImageViewProps> = (props) => {
  const repository = useRepository()
  const formLocalization = useLocalization().forms
  const globalClasses = useGlobalStyles()
  const classes = useStyles()
  const [currentContent, setCurrentContent] = useState<GenericContent>()
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const [metadataError, setMetadataError] = useState<string>()
  const [decodeError, setDecodeError] = useState<string>()
  const imageLocalization = useLocalization().imageGallery
  const {
    source: imageSource,
    error: imageError,
    isLoading,
  } = useRepositoryImage(
    repository,
    currentContent ? getImageContentUrl(repository.configuration.repositoryUrl, currentContent) : undefined,
    { revision: currentContent?.ModificationDate?.toString() },
  )
  const loadError = metadataError || imageError || decodeError
  useEffect(() => {
    const controller = new AbortController()
    let current = true
    setCurrentContent(undefined)
    setMetadataError(undefined)
    async function getCurrentContent() {
      try {
        const result = await repository.load({
          idOrPath: props.contentPath,
          requestInit: { signal: controller.signal },
        })
        if (current) setCurrentContent(result.d)
      } catch (error) {
        if (current && !controller.signal.aborted) {
          setMetadataError(error instanceof Error ? error.message : String(error))
        }
      }
    }
    getCurrentContent()
    return () => {
      current = false
      controller.abort()
    }
  }, [props.contentPath, repository])
  useEffect(() => setDecodeError(undefined), [imageSource])
  return (
    <div className={classes.imageViewContainer}>
      <div className={classes.titleContainer}>
        <div className={classes.title}>
          <span data-test={'image-view-title'} className={classes.contentName}>
            {currentContent?.DisplayName}
          </span>
        </div>
      </div>
      <div className={classes.imageContainer}>
        {(!currentContent || isLoading) && !loadError ? <CircularProgress /> : null}
        {loadError ? <Typography color="error">{loadError}</Typography> : null}
        {imageSource ? (
          <img
            className={classes.image}
            src={imageSource}
            alt={currentContent?.DisplayName || ''}
            onError={() => setDecodeError(imageLocalization.unsupportedImage)}
          />
        ) : null}
      </div>
      <div className={classes.buttonWrapper}>
        <Button
          aria-label={formLocalization.close}
          color="default"
          className={globalClasses.cancelButton}
          onClick={() => {
            navigateToAction({ history, routeMatch })
            props.handleCancel?.()
          }}>
          {formLocalization.close}
        </Button>
      </div>
    </div>
  )
}
