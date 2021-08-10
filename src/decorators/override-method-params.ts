import { getResolver, Injector, makeConstructorDecorator } from '@mazulatas/meta.js'
import { IResolverContext } from '@mazulatas/meta.js/models/core/resolver-context'
import { Logger } from '../entities'

export const OverrideMethodParams = makeConstructorDecorator({ handler, moment: 'afterCreateInstance' })

function handler(instance: any) {
  const ctor = instance.constructor
  const injector = Injector.getInjector(ctor)
  if (!injector) throw new Error('override method params error: injector not exist')
  const logger = injector.get(Logger)
  const resolver = getResolver(ctor)
  const parameters = resolver.getContextByType('param')
  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i]
    const methodName = parameter.props[1]
    if (Reflect.get(instance, methodName)?.override) continue
    const wrapper = buildWrapper(instance, methodName, parameters, logger)
    Reflect.defineProperty(instance, methodName, { value: wrapper, writable: false, enumerable: false })
  }
}

function buildWrapper(instance: any, methodName: string, context: IResolverContext[], logger: Logger) {
  const handler: Function = Reflect.get(instance, methodName)
  const mutators = context
    .filter(ctx => ctx.props[1] === methodName)
    .map(ctx => ctx.props)
    .sort((v1, v2) => v1[2] - v2[2])
    .map(props => props[0])
  const wrapper = function() {
    const args = arguments
    Promise.all(mutators.map(fn => {
      try {
        return fn.apply(null, args)
      } catch (e) {
        logger.error('error in mapping parameters', e)
        return null
      }
    })).then(result => handler.apply(instance, result))
  }
  Reflect.defineProperty(wrapper, 'name', { value: handler.name, writable: false, enumerable: false })
  Reflect.defineProperty(wrapper, 'override', { value: true, writable: false, enumerable: false })
  return wrapper
}
