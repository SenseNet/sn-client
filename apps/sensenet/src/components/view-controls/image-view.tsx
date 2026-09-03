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
  const { contentPath } = props
  const [currentContent, setCurrentContent] = useState<GenericContent>()
  const history = useHistory()
  const routeMatch = useRouteMatch<{ browseType: string; action?: string }>()
  const [imageSource, setImageSource] = useState<string>()
  const [loadError, setLoadError] = useState<string>()
  useEffect(() => {
    async function getCurrentContent() {
      const result = await repository.load({
        idOrPath: props.contentPath,
      })
      setCurrentContent(result.d)
    }
    getCurrentContent()
  }, [props.contentPath, repository])
  useEffect(() => {
    if (!currentContent) {
      return
    }

    const abortController = new AbortController()
    let objectUrl: string | undefined
    let isCurrentRequest = true
    setImageSource(undefined)
    setLoadError(undefined)

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

        objectUrl = URL.createObjectURL(await response.blob())
        if (isCurrentRequest) {
          setImageSource(objectUrl)
        }
      } catch (error) {
        if (isCurrentRequest && !abortController.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : String(error))
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
  }, [currentContent, repository])
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
        {!imageSource && !loadError ? <CircularProgress /> : null}
        {loadError ? <Typography color="error">{loadError}</Typography> : null}
        {imageSource ? (
          <img className={classes.image} src={imageSource} alt={currentContent?.DisplayName || ''} />
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
