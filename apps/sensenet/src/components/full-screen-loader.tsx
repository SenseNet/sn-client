import CircularProgress from '@material-ui/core/CircularProgress'
import clsx from 'clsx'
import React from 'react'
import { useGlobalStyles } from '../globalStyles'
import { useLocalization } from '../hooks'

export const FullScreenLoader = ({ loaderText }: { loaderText?: string }) => {
  const { centered, full } = useGlobalStyles()
  const { loadingContent } = useLocalization().common

  return (
    <div className={clsx(centered, full)}>
      <CircularProgress color="primary" />{' '}
      <span style={{ fontSize: '1.5em', marginLeft: 20 }}>{loaderText ?? loadingContent}</span>
    </div>
  )
}
