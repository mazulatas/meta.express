import { combineDecorators, IInjectableOptions, Injectable, Injector, makeConstructorDecorator } from '@mazulatas/meta.js'
import { Logger } from '../entities'
import { IMiddleware } from '../models'
import { ExpressAppInstance } from '../tokens'
import { OverrideMethodParams } from './override-method-params'

export const Middleware = combineDecorators<(IInjectableOptions & { [key: string]: any }) | void>([
  Injectable as any,
  OverrideMethodParams,
  makeConstructorDecorator({ handler, moment: 'afterCreateInstance', name: 'Middleware', prohibitDuplicates: true })
])

function handler(instance: IMiddleware) {
  const ctor = instance.constructor
  const injector = Injector.getInjector(ctor)
  if (!('use' in instance)) throw new Error(`${ctor.name} not implemented IMiddleware interface`)
  if (typeof instance.use !== 'function') throw new Error(`target method use in ${ctor.name} not a function`)
  if (!injector) throw new Error('middleware error: injector not exist')
  const app = injector.get(ExpressAppInstance)
  const logger = injector.get(Logger)
  function middlewareHandler() {
    try {
      return instance.use.apply(instance, arguments as any)
    } catch (err) {
      throw new Error(`middleware error: ${err}`)
    }
  }
  Reflect.defineProperty(middlewareHandler, 'length', { value: 3, writable: false, enumerable: false })
  app.use(middlewareHandler)
  logger.info(`register middleware ${ctor.name}`)
}
