import { Checkbox } from '@material-ui/core'
import React from 'react'

export function CheckBoxFormatter(props: any) {
  console.log(props.value)
  return (
    <>
      <Checkbox className="gridRowCheckbox" />
    </>
  )
}
