import { Injectable } from '@mazulatas/meta.js'
import { Logger } from '../../src/entities'

@Injectable({
  provideAs: Logger
})
export class TestLogger extends Logger {
  public readonly errorSpy = jasmine.createSpy()
  public readonly infoSpy = jasmine.createSpy()
  public readonly warnSpy = jasmine.createSpy()

  public error(...message: string[]): void {
    return this.errorSpy()
  }

  public info(...message: string[]): void {
    return this.infoSpy()
  }

  public warn(...message: string[]): void {
    return this.warnSpy()
  }

}
