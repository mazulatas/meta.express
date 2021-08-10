export interface IRestMapperOptions {
  path: string
}

export type RestMapperType = 'get' | 'post' | 'delete' | 'head' | 'put'

export interface IRestMapperInnerOptions extends IRestMapperOptions {
  type: RestMapperType
  methodName: string
}
