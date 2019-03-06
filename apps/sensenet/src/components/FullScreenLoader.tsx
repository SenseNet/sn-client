import React from 'react'
import fullScreenLoader from '../assets/loader-fullscreen.gif'
export const FullScreenLoader = () => (
  <img
    style={{
      margin: 'auto',
      filter: 'drop-shadow(0px 0px 5px white) drop-shadow(0px 0px 3px white) drop-shadow(0px 0px 15px white)',
    }}
    src={fullScreenLoader}
  />
)
