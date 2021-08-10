import { Injector } from '@mazulatas/meta.js'
import { ExpressApp } from '../../src'
import { Logger } from '../../src/entities'
import { TestLogger } from '../ulils/test-logger'

describe('Express App', () => {
  it('should create express app', (done) => {
    @ExpressApp({
      port: 3000,
      providers: [
        TestLogger
      ]
    })
    class App {

    }

    setTimeout(() => {
      const injector = Injector.getInjector(App) as Injector
      expect(injector).toBeTruthy()
      const logger = injector.get<TestLogger>(Logger)
      expect(logger.infoSpy).toHaveBeenCalled()
      done()
    })
  })
})
