import { createStyles, makeStyles } from '@material-ui/core'
import { Stop } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'

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

  const [widths, setWidths] = useState<string[]>(
    props.visualParts.map(() => {
      return '0px'
    }),
  )
  useEffect(() => {
    setWidths(
      props.visualParts.map((item) => {
        return item.percentage
      }),
    )
  }, [props.visualParts])

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
                width: widths[index],
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
              <span>{item.title}</span>
            </div>
          )
        })}
        <div className={classes.legend}>
          <Stop style={{ fill: props.backgroundColor }} />
          <span>Available</span>
        </div>
      </div>
    </>
  )
}
