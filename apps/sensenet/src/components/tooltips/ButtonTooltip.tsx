import { createStyles, makeStyles, Theme } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => {
  const fontColorLightnes = theme.palette.type === 'light' ? '46' : '50'

  return createStyles({
    btnTooltip: {
      color: `hsl(0deg 0% ${fontColorLightnes}%)`,
      fontSize: '8px',
      textAlign: 'center',
      display: 'flex',
      padding: '0px 3px',
    },
  })
})

export interface buttonTooltipProps {
  title: string
}

export const ButtonTooltip = (props: buttonTooltipProps): JSX.Element => {
  const { title } = props
  const classes = useStyles()

  return <div className={classes.btnTooltip}>{title}</div>
}
