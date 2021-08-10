import { IRequest, IResponse } from '../../models'
import { makeRestMapperParams } from './make-rest-mapper-params'

export const Request = makeRestMapperParams((req: IRequest) => req)
export const Response = makeRestMapperParams((_: void, res: IResponse) => res)
export const Next = makeRestMapperParams((_: void, __: void, next: any) => next)
export const Body = makeRestMapperParams((req: IRequest) => req.body)
