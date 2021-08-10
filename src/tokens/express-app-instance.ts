import { InjectionToken } from '@mazulatas/meta.js'
import { Express } from 'express'

export const ExpressAppInstance = InjectionToken.create<Express>('Express App Instance')
