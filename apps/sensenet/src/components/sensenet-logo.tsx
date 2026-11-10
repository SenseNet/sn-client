import React from 'react'
import logo from '../assets/admin-favicon.svg'

export function SensenetLogo(props: Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
  return <img src={logo} alt="sensenet" width={32} height={32} {...props} />
}
