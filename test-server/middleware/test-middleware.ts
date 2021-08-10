import { NextFunction } from 'express'
import { IMiddleware, IRequest, Next, Request } from '../../src'
import { Middleware } from '../../src/decorators/middleware'

@Middleware()
export class TestMiddleware implements IMiddleware {

  public use(@Next() next: NextFunction, @Request() rqe: IRequest): any {
    debugger
    return next()
  }

}
