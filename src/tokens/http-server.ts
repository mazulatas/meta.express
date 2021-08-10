import { InjectionToken } from '@mazulatas/meta.js'
import { Server } from 'http'

export const HttpServer = InjectionToken.create<Server>('HttpServer')
