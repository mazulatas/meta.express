import { ExpressApp } from '../src'
import { ConsoleLogger } from './console-logger'
import { TestRestController } from './controlllers/test-rest-controller'
import { TestMiddleware } from './middleware/test-middleware'

@ExpressApp({
  port: 3030,
  middleware: [
    TestMiddleware
  ],
  controllers: [
    TestRestController
  ],
  providers: [
    ConsoleLogger,
  ]
})
class App {

}
