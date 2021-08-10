import { Body, Get, IRequest, IResponse, Next, Post, Request, Response, RestController } from '../../src'

@RestController({
  path: '/test'
})
export class TestRestController {

  // @Get({ path: '/test' })
  // public testGet(@Request() request: IRequest, @Next() next: NextFunction, @Response() res: IResponse) {
  //   // tslint:disable-next-line:no-magic-numbers
  //   res.sendStatus(200)
  // }

  @Post({ path: '/testPost' })
  public testPost(@Request() request: IRequest, @Body() body: any, @Response() res: IResponse) {
    console.warn(body)
    // tslint:disable-next-line:no-magic-numbers
    res.sendStatus(200)
  }
}
