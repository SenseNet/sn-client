import { Button } from '@material-ui/core'
import React, { SetStateAction } from 'react'
import { useLocalization } from '../../hooks'
import { defaultFieldSettings } from '../edit/default-content-type'

export interface IAppProps {
  setTextValue: (value: SetStateAction<string>) => void
}

const injectorString = '</Fields>'

export const ContentTypePreset = (props: IAppProps) => {
  const localization = useLocalization()

  return (
    <>
      <div className="title">{localization.textEditor.presets}</div>
      <div className="presets">
        {defaultFieldSettings.map((preset) => {
          const { value, title, name } = preset

          return (
            <Button
              key={title}
              data-test={`preset-button-${name}`}
              onClick={() => {
                props.setTextValue((prev) => prev.replace(injectorString, value + injectorString))
              }}
              variant="outlined"
              color="primary">
              {title}
            </Button>
          )
        })}
      </div>
    </>
  )
}
