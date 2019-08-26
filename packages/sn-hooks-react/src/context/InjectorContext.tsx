import { Injector } from '@furystack/inject/dist/Injector'
import React from 'react'

export const InjectorContext = React.createContext(new Injector())
