import { makeMethodDecorator } from '@mazulatas/meta.js'
import { IRestMapperOptions, RestMapperType } from '../../models/rest-mapper-options'
import { restMappers } from '../../models/symbols'

export function makeRestMapper(type: RestMapperType) {

  function handler(ctx: any, props: IRestMapperOptions, methodName: string) {
    const mappers = Reflect.get(ctx, restMappers) || []
    if (!Reflect.has(ctx, restMappers)) Reflect.set(ctx, restMappers, mappers)
    mappers.push({ ...props, type, methodName })
  }

  return makeMethodDecorator<IRestMapperOptions>({ handler, moment: 'decorate' })
}
