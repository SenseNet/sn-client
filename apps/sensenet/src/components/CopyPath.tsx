import { createStyles, makeStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import React, { useState } from 'react'
import { globals } from '../globalStyles'
import { useLocalization } from '../hooks'
import { ButtonTooltip } from './tooltips/ButtonTooltip'

type Props = { copyText: string }

const useStyles = makeStyles(() => {
  return createStyles({
    buttonWrapper: {
      display: 'flex',
      lineHeight: 1.1,
    },
    button: {
      border: globals.common.grayBorder,
      boxShadow: globals.common.buttonBoxShadow,
      padding: '5px 3px',
    },
  })
})

const CopyPath = ({ copyText }: Props) => {
  const [isCopied, setIsCopied] = useState(false)

  const localization = useLocalization()

  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    }

    return document.execCommand('copy', true, text)
  }

  const handleCopyClick = () => {
    copyTextToClipboard(copyText)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const classes = useStyles()

  return (
    <div className={classes.buttonWrapper}>
      <Button onClick={handleCopyClick} className={classes.button}>
        {isCopied ? <CheckCircleOutlineOutlinedIcon style={{ color: 'lightgreen' }} /> : <FileCopyOutlinedIcon />}
        <ButtonTooltip title={localization.batchActions.copyPath} />
      </Button>
    </div>
  )
}

export default CopyPath
