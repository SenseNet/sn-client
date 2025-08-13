import React from 'react'

export type TInfluenceField = {
  name?: string
  description?: string
  radioOptions: Array<{ optionTitle: string; influencedFieldId: string; value: string }>
}

export const InfluenceField: React.FC<TInfluenceField> = ({ name, description, radioOptions }) => {
  return (
    <div className="input-container">
      <h3>{name}</h3>
      <p>{description}</p>

      {radioOptions.map((option) => {
        const { optionTitle, value, influencedFieldId } = option

        return (
          <>
            <input
              type="radio"
              id={optionTitle}
              name={name}
              value={optionTitle}
              onClick={() => {
                const element = document.getElementById(influencedFieldId) as HTMLInputElement

                if (!element) {
                  return
                }

                element.value = value
              }}
            />
            <label htmlFor={optionTitle}>{optionTitle}</label>
          </>
        )
      })}
    </div>
  )
}
