export abstract class Logger {
  public abstract info(...message: string[]): void
  public abstract warn(...message: string[]): void
  public abstract error(...message: string[]): void
}

export class StubLogger extends Logger {
  public error(...message: string[]): void {
  }

  public info(...message: string[]): void {
  }

  public warn(...message: string[]): void {
  }

}
