import Button from '@material-ui/core/Button'
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined'
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined'
import React, { useState } from 'react'

type Props = { copyText: string }

const CopyPath = ({ copyText }: Props) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
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
      <Button onClick={handleCopyClick}>
        <span>
          {isCopied ? <CheckCircleOutlineOutlinedIcon style={{ color: 'lightgreen' }} /> : <FileCopyOutlinedIcon />}
        </span>
      </Button>
    </div>
  )
}

export default CopyPath
