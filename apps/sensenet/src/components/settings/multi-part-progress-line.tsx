import { createStyles, makeStyles } from '@material-ui/core'
import { Stop } from '@material-ui/icons'
import React from 'react'
import { useLocalization } from '../../hooks'

const useStyles = makeStyles(() => {
  return createStyles({
    progressVisualFull: {
      display: 'flex',
      height: '30px',
      margin: '20px 0',
    },
    legend: {
      marginRight: '20px',
      display: 'flex',
      alignItems: 'center',
    },
  })
})

export interface VisualPartsType {
  percentage: string
  color: string
  title: string
}

export interface MultiPartProgressLineProps {
  backgroundColor: string
  visualParts: VisualPartsType[]
}

export const MultiPartProgressLine: React.FunctionComponent<MultiPartProgressLineProps> = (props) => {
  const classes = useStyles()
  const localization = useLocalization()

  return (
    <>
      <div
        className={classes.progressVisualFull}
        style={{
          backgroundColor: props.backgroundColor,
        }}>
        {props.visualParts.map((item: VisualPartsType, index) => {
          return (
            <div
              key={index}
              style={{
                width: item.percentage ?? '0px',
                backgroundColor: item.color,
              }}
            />
          )
        })}
      </div>
      <div className={classes.progressVisualFull}>
        {props.visualParts.map((item: VisualPartsType, index) => {
          return (
            <div key={index} className={classes.legend}>
              <Stop style={{ fill: item.color }} />
              {item.title}
            </div>
          )
        })}
        <div className={classes.legend}>
          <Stop style={{ fill: props.backgroundColor }} />
          {localization.multiPartProgressLine.available}
        </div>
      </div>
    </>
  )
}
