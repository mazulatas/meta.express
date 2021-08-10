import {
  asyncHandler,
  combineDecorators, getDeepField,
  hasDeepField,
  Injectable,
  Injector,
  makeConstructorDecorator,
  Provider,
  SELF_PROVIDER
} from '@mazulatas/meta.js'
import express, { Express } from 'express'
import expressWs from 'express-ws'
import { createServer } from 'http'
import { Logger, StubLogger } from '../entities'
import { IExpressAppOptions } from '../models'
import { ExpressAppInstance } from '../tokens'
import { ExpressWsAppInstance } from '../tokens/express-ws-app-instance'
import { HttpServer } from '../tokens/http-server'
import { AutoCreateInstance } from './auto-create-Instance'

export const ExpressApp = combineDecorators<IExpressAppOptions>([
  makeConstructorDecorator({ handler: crateExpressInstance, moment: 'decorate', name: 'CreateExpressInstance', prohibitDuplicates: true }),
  Injectable as any,
  makeConstructorDecorator([
    { handler: runProviders, moment: 'decorate' },
    { handler: asyncHandler(startExpressServer), moment: 'decorate' }
  ]),
  AutoCreateInstance
])

function crateExpressInstance(_: any, props: IExpressAppOptions) {
  const app = express()
  const server = createServer(app)
  const wsApp = expressWs(app)
  props.use?.forEach(u => app.use(u))
  const innerProviders: Provider<any>[] = []
  if (!props.providers?.some(p => Reflect.get(p, 'prototype') instanceof Logger || ('token' in p && p.token === Logger))) {
    innerProviders.push({ token: Logger, useClass: StubLogger })
  }
  const controllers = props.controllers || []
  const middleware = props.middleware || []
  props.providers = [
    { token: HttpServer, useValue: server },
    { token: ExpressAppInstance, useValue: app },
    { token: ExpressWsAppInstance, useValue: wsApp },
    ...middleware,
    ...controllers,
    ...innerProviders,
    ...props.providers || []
  ]
}

function runProviders(ctx: any, props: IExpressAppOptions) {
  const injector = Injector.getInjector(ctx)
  if (!injector) throw new Error('run controllers error: injector not exist')
  const app = injector.get(ExpressAppInstance)
  run(app, injector, props.middleware || [])
  run(app, injector, props.controllers || [])
}

function startExpressServer(ctx: any, props: IExpressAppOptions) {
  const injector = Injector.getInjector(ctx)
  if (!injector) throw new Error('create express instance error: express instance missed the injector')
  const server = injector.get(HttpServer)
  const logger = injector.get(Logger)
  server.listen(props.port, () => logger.info(`App listening on the port ${props.port}`))
}

function run(app: Express, injector: Injector, providers: any[]) {
  for (let i = 0; i < providers.length; i++) {
    const rawProvider = providers[i]
    const provider = hasDeepField(rawProvider, SELF_PROVIDER) ? getDeepField(rawProvider, SELF_PROVIDER) : rawProvider
    const token = 'token' in provider ? provider.token : provider
    injector.get(token)
  }
}
