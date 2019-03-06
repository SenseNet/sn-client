export const createAction = <TReturns extends { type: string }, TArgs extends any[]>(
  creator: (...args: TArgs) => TReturns,
) => {
  const actionType = (creator as any)().type
  ;(creator as any).actionType = actionType
  return creator as typeof creator & { actionType: string }
}

export const isFromAction = <TAction extends ((...args: any[]) => any) & { actionType: string }>(
  action: { type: string },
  expectedAction: TAction,
): action is ReturnType<TAction> => action.type === expectedAction.actionType
