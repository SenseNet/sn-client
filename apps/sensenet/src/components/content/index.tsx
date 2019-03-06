import React, { useContext } from 'react'
import { ResponsivePersonalSetttings } from '../ResponsiveContextProvider'
import Commander from './Commander'
import { Explore } from './Explore'
import { SimpleList } from './Simple'

export const Content: React.FunctionComponent = () => {
  const personalSettings = useContext(ResponsivePersonalSetttings)

  if (personalSettings.content.browseType === 'commander') {
    return <Commander />
  } else if (personalSettings.content.browseType === 'explorer') {
    return <Explore />
  } else if (personalSettings.content.browseType === 'simple') {
    return <SimpleList />
  }
  return null
}

export default Content
