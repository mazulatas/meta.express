import { makeParamDecorator, stub } from '@mazulatas/meta.js'

export function makeRestMapperParams(mutator: Function) {

  function propsMutator() {
    return mutator
  }

  return makeParamDecorator<void>({ handler: stub, propsMutator })
}
