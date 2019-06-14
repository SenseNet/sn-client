/* eslint-disable prefer-spread */
import React from 'react'
import '../../assets/css/animated-background.css'

export const GridPlaceholder = (props: {
  rows?: number
  columns?: number
  style?: React.CSSProperties
  columnStyle?: React.CSSProperties
  rowStyle?: React.CSSProperties
}) => {
  return (
    <div style={props.style} data-cy="gridPlaceholder">
      {(Array.apply(null, { length: props.columns || 10 } as any).map(Number.call, Number) as number[]).map(c => (
        <div key={c} className="column" style={{ display: 'flex', ...props.columnStyle }}>
          {(Array.apply(null, { length: props.rows || 5 } as any).map(Number.call, Number) as number[]).map(r => (
            <div
              key={r}
              className="row animated-background"
              style={{
                height: '48px',
                flexGrow: 1,
                margin: '.5em',
                ...props.rowStyle,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
