import { Tooltip } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import React, { useState } from 'react'
import { useLocalization } from '../hooks'

type Props = { copyText: string }

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

  return (
    <div>
      <Tooltip title={localization.batchActions.copyPath} placement="bottom">
        <Button onClick={handleCopyClick}>
          {isCopied ? <CheckCircleOutlineOutlinedIcon style={{ color: 'lightgreen' }} /> : <FileCopyOutlinedIcon />}
        </Button>
      </Tooltip>
    </div>
  )
}

export default CopyPath
