import { Injectable } from '@mazulatas/meta.js'
import { Logger } from '../src/entities'

@Injectable({
  provideAs: Logger
})
export class ConsoleLogger extends Logger {
  public error(...message: string[]): void {
    console.error(...message)
  }

  public info(...message: string[]): void {
    // tslint:disable-next-line:no-console
    console.log(...message)
  }

  public warn(...message: string[]): void {
    console.warn(...message)
  }

}
