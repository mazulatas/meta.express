import { asyncHandler, getDeepField, hasDeepField, Injector, makeConstructorDecorator, SELF_PROVIDER } from '@mazulatas/meta.js'

export const AutoCreateInstance = makeConstructorDecorator(
  { handler: asyncHandler(handler), moment: 'decorate', name: 'AutoCreateInstance', prohibitDuplicates: true }
)

function handler(ctx: any) {
  const injector = Injector.getInjector(ctx)
  if (!injector) throw new Error(`auto create instance error: ${ctx.name} is not an injectable entity`)
  const provider = hasDeepField(ctx, SELF_PROVIDER) ? getDeepField(ctx, SELF_PROVIDER) : ctx
  const token = 'token' in provider ? provider.token : provider
  return injector.get(token)
}
