/**
 * Creates an action with a static Type property
 * @param creator The Redux action creator method
 */
export const createAction = <TReturns extends { type: string }, TArgs extends any[]>(
  creator: (...args: TArgs) => TReturns,
) => {
  const actionType = (creator as any)().type
  ;(creator as any).actionType = actionType
  return creator as typeof creator & { actionType: string }
}
