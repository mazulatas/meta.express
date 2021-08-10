import { IFProviders, IType } from '@mazulatas/meta.js'
import { IMiddleware } from './middleware'

export interface IExpressAppOptions extends IFProviders {
  port: number
  use?: any[]
  controllers?: IType<any>[]
  middleware?: IType<IMiddleware>[]
}
