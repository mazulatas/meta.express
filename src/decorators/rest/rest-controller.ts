import { combineDecorators, Injectable, Injector, makeConstructorDecorator } from '@mazulatas/meta.js'
import { Router } from 'express'
import { Logger } from '../../entities'
import { IRestControllerOptions } from '../../models/rest-controller-options'
import { restMappers } from '../../models/symbols'
import { ExpressAppInstance } from '../../tokens'
import { OverrideMethodParams } from '../override-method-params'

export const RestController = combineDecorators<IRestControllerOptions>([
  Injectable as any,
  OverrideMethodParams,
  makeConstructorDecorator({ handler, name: 'RestController', prohibitDuplicates: true, moment: 'afterCreateInstance' })
])

function handler(instance: any, props: IRestControllerOptions) {
  const ctor = instance.constructor
  const injector = Injector.getInjector(ctor)
  if (!injector) throw new Error('create rest controller error: injector not exist')
  const logger = injector.get(Logger)
  const app = injector.get(ExpressAppInstance)
  logger.info(`register controller ${ctor.name}, controller base path`, props.path)
  const mappers = Reflect.get(ctor, restMappers) || []
  const router = Router()
  for (let i = 0; i < mappers.length; i++) {
    const mapper = mappers[i]
    const path = props.path + mapper.path
    const method = mapper.type
    const routerHandler = Reflect.get(router, method)
    if (!routerHandler) throw new Error(`create rest controller error: method ${method} from ${mapper.methodName} not exist`)
    const handler: Function = Reflect.get(instance, mapper.methodName)
    routerHandler.apply(router, [ mapper.path, handler.bind(instance) ])
    logger.info(`add route ${method.toUpperCase()} ${path} in ${ctor.name}`)
  }
  app.use(props.path, router)
}
