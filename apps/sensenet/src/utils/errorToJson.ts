export const getErrorObject = (e: Error) => {
  const ownProps = Object.getOwnPropertyNames(e)
  const returns: any = {}
  ownProps.map((ownprop) => (returns[ownprop] = (e as any)[ownprop]))
  return returns
}

declare global {
  export interface Error {
    toJSON: () => {}
  }
}

// eslint-disable-next-line no-extend-native
Error.prototype.toJSON = function () {
  return getErrorObject(this)
}
