import { InjectionToken } from '@mazulatas/meta.js'
import { Instance } from 'express-ws'

export const ExpressWsAppInstance = InjectionToken.create<Instance>('ExpressWsAppInstance')
